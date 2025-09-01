import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { deletionSingle } from '../Utils/CloudinaryUtils.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function getUserInfoService(userId) {
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
// prettier-ignore
async function putUserService(userId, { password, currentPassword, profileImage, ...data },) {
  // 패스워드가 값이 있을때만 변경하도록 테스트
  // prettier-ignore
  if ((password && password !== '') && (currentPassword && currentPassword !== '')) { 
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    }); 
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.statusCode = 401;
      throw error;
    }
    // 업데이트할 내용에 password 추가
    data = {
      ...data,
      password,
    }
  }
  // 프로필 이미지 처리 
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { imageId: true },
  });

  let newImage;
  // 새 프로필 이미지가 제공된 경우
  if (profileImage && profileImage !== '') {
    // 1. 기존 이미지가 있다면 삭제
    if (currentUser.imageId) {
      const oldImage = await prisma.image.findUnique({
        where: { id: currentUser.imageId },
        select: { url: true },
      });

      if (oldImage) {
        // cloudinary에서 프로필 이미지 삭제
        await deletionSingle(cloudinary, oldImage)
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
    data = {
      ...data,
      profileImage,
      imageId: newImage.id,
    }
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
    }
  });
  return putUser;
}
async function deleteUserService(userId) {
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
      const img = await tx.image.findUniqueOrThrow({
        where: { id: deleteUser.imageId },
      });
      // cloudinary에서 프로필 이미지 삭제
      await deletionSingle(cloudinary, img);
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
    const styleCountUpdates = {};

    // 좋아요 처리: 업데이트 목록에 추가
    deleteUser.likes.forEach((like) => {
      if (!styleCountUpdates[like.styleId]) {
        styleCountUpdates[like.styleId] = { likeCount: 0, curationCount: 0 };
      }
      styleCountUpdates[like.styleId].likeCount = 1;
    });

    // 큐레이션 처리: 업데이트 목록에 추가
    deleteUser.Curation.forEach((curation) => {
      if (!styleCountUpdates[curation.styleId]) {
        styleCountUpdates[curation.styleId] = { likeCount: 0, curationCount: 0 };
      }
      styleCountUpdates[curation.styleId].curationCount = 1;
    });

    // 집계된 카운트를 바탕으로 스타일 업데이트
    const updatePromises = Object.keys(styleCountUpdates).map((styleId) => {
      return tx.style.update({
        where: { id: Number(styleId) },
        data: {
          likeCount: {
            decrement: styleCountUpdates[styleId].likeCount,
          },
          curationCount: {
            decrement: styleCountUpdates[styleId].curationCount,
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
async function getUserStyleService(userId, { page, limit }) {
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
    skip: (page - 1) * limit,
    take: parseInt(limit), // 추후에 validation 추가
  });
  const userStyles = {
    data: userStyle.map((style) => ({
      ...style,
      tags: style.tags.map((tag) => tag.tagname),
    })),
  };
  return userStyles;
}
async function getUserLikeStyleService(userId, { page = 1, limit = 9 }) {
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
    skip: (page - 1) * limit,
    take: parseInt(limit),
  });

  const totalItemCount = await prisma.styleLike.count({
    where: { userId: userId },
  });

  const transformedStyles = userLikedStyles.map((like) => ({
    ...like.style,
    tags: like.style.tags ? like.style.tags.map((tag) => tag.tagname) : [],
  }));

  const totalPages = Math.ceil(totalItemCount / parseInt(limit));

  return {
    currentPage: parseInt(page),
    totalPages,
    totalItemCount,
    data: transformedStyles,
  };
}

export { getUserStyleService, getUserLikeStyleService, getUserInfoService, deleteUserService, putUserService };
