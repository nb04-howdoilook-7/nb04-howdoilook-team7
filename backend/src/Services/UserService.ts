import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { deletionSingle } from '../Libs/cloudinary.js';
import type { GetUserStyle, PutUser, UserId } from '../types/users.types.js';

const prisma = new PrismaClient();

async function getUserInfoService({ userId }: UserId) {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      profileImage: true,
      _count: {
        select: {
          Curation: true,
          Style: true,
          likes: true,
        },
      },
    },
  });
  return userInfo;
}

async function putUserService({ userId, data }: PutUser) {
  const { password, currentPassword, profileImage, ...restData } = data;
  const updateData: Prisma.UserUpdateInput = { ...restData };
  // 패스워드가 값이 있을때만 변경하도록 테스트
  if (password && password !== '' && currentPassword && currentPassword !== '') {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        password: true,
      },
    });
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      // error.statusCode = 401;
      throw error;
    }
    // 업데이트할 내용에 password 추가
    updateData['password'] = password;
  }
  // 프로필 이미지 처리
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { imageId: true },
  });

  let newImage;
  // 새 프로필 이미지가 제공된 경우
  if (profileImage && profileImage !== '') {
    // 1. 기존 이미지가 있다면 삭제
    if (currentUser.imageId) {
      const { url } = await prisma.image.findUniqueOrThrow({
        where: { id: currentUser.imageId },
        select: { url: true },
      });

      if (url) {
        // cloudinary에서 프로필 이미지 삭제
        await deletionSingle(url);
        // DB에서 기존 Image 레코드 삭제
        await prisma.image.delete({ where: { id: currentUser.imageId } });
      }
    }

    // 2. 새 Image 레코드 생성
    newImage = await prisma.image.create({
      data: {
        url: profileImage,
      },
    });
    // 업데이트할 내용에 프로필 이미지, 이미지 모델 연결 추가
    updateData['profileImage'] = profileImage;
    updateData['image'] = {
      connect: {
        id: newImage.id,
      },
    };
  }

  // 최종 put 요청 <- 여기만 추가해보고 테스트
  const putUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
    include: {
      _count: {
        select: {
          Curation: true,
          Style: true,
        },
      },
    },
  });
  return putUser;
}
async function deleteUserService({ userId }: UserId) {
  // 유저를 삭제할 때 관계된 이미지부터 먼저 삭제
  // 1. 유저랑 연결된 이미지 조회
  // 2. 클라우디너리에서 해당 이미지 삭제
  // 3. db Image 테이블에서 해당 이미지 삭제
  // 4. 유저와 관련된 모든 스타일의 태그사용량 감소
  // 5. 유저와 관련된 큐레이션, 좋아요 수 감소
  // 6. 유저 삭제
  // prettier-ignore
  const result = await prisma.$transaction(async (tx) => {
    const deleteUser = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        imageId: true,
        Style: {
          include: {
            tags: true,
          },
        },
        Curation: true,
        likes: true,
      },
    }); // 삭제할 유저 조회

    if (deleteUser && deleteUser.imageId) {
      // 삭제할 유저의 프로필 사진 조회
      const {url} = await tx.image.findUniqueOrThrow({
        where: { id: deleteUser.imageId },
      });
      // cloudinary에서 프로필 이미지 삭제
      await deletionSingle(url);
      // DB에서 기존 Image 레코드 삭제
      await tx.image.delete({ where: { id: deleteUser.imageId } });
    }

    // 사용자가 생성한 스타일에 포함된 태그들의 사용 횟수 감소
    const tagIds = deleteUser.Style.flatMap((style) => style.tags.map((tag) => tag.id));
    if (tagIds.length > 0) {
      await tx.tag.updateMany({
        where: {
          id: {
            in: tagIds,
          },
        },
        data: {
          totalUsageCount: {
            decrement: 1,
          },
        },
      });
    }

    // 사용자가 누른 좋아요, 작성한 큐레이션으로 인한 카운트 감소 처리
    
    // 1. 관련된 모든 스타일 ID를 중복 없이 모읍니다.
    const likedStyleIds = deleteUser.likes.map((like) => like.styleId);
    const curatedStyleIds = deleteUser.Curation.map((curation) => curation.styleId);
    const uniqueStyleIds = [...new Set([...likedStyleIds, ...curatedStyleIds])];

    // 2. 각 스타일에 대한 업데이트 작업을 생성합니다.
    const updatePromises = uniqueStyleIds.map((styleId) => {
      // 이 유저가 해당 스타일에 좋아요를 눌렀는지 확인
      const hasLiked = likedStyleIds.includes(styleId);
      // 이 유저가 해당 스타일에 큐레이션을 했는지 확인
      const hasCurated = curatedStyleIds.includes(styleId);

      return tx.style.update({
        where: { id: styleId }, // styleId는 여기서 number 타입이므로 안전합니다.
        data: {
          likeCount: {
            // 좋아요를 눌렀다면 1, 아니면 0을 감소시킵니다.
            decrement: hasLiked ? 1 : 0,
          },
          curationCount: {
            // 큐레이션을 했다면 1, 아니면 0을 감소시킵니다.
            decrement: hasCurated ? 1 : 0,
          },
        },
      });
    });

    await Promise.all(updatePromises);

    const user = await tx.user.delete({
      // 유저 삭제
      where: { id: userId },
    });
    return user;
  });
  return result;
}
async function getUserStyleService({ userId, page, pageSize }: GetUserStyle) {
  const userStyle = await prisma.style.findMany({
    where: { userId },
    select: {
      id: true,
      thumbnail: true,
      title: true,
      categories: true,
      content: true,
      viewCount: true,
      curationCount: true,
      likeCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
      tags: {
        select: {
          tagname: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize, // 추후에 validation 추가
  });
  const userStyles = {
    data: userStyle.map((style) => ({
      ...style,
      tags: style.tags.map((tag) => tag.tagname),
    })),
  };
  return userStyles;
}
async function getUserLikeStyleService({ userId, page, pageSize }: GetUserStyle) {
  const userLikedStyles = await prisma.styleLike.findMany({
    where: { userId: userId },
    select: {
      style: {
        select: {
          id: true,
          thumbnail: true,
          title: true,
          categories: true,
          content: true,
          viewCount: true,
          curationCount: true,
          likeCount: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
          tags: {
            select: {
              tagname: true,
            },
          },
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalItemCount = await prisma.styleLike.count({
    where: { userId: userId },
  });

  const transformedStyles = userLikedStyles.map((like) => ({
    ...like.style,
    tags: like.style.tags ? like.style.tags.map((tag) => tag.tagname) : [],
  }));

  const totalPages = Math.ceil(totalItemCount / pageSize);

  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data: transformedStyles,
  };
}

export {
  getUserStyleService,
  getUserLikeStyleService,
  getUserInfoService,
  deleteUserService,
  putUserService,
};
