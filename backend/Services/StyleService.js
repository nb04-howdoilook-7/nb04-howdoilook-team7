import { PrismaClient } from '@prisma/client';
import imageToImageUrls from '../Utils/ImageToImageUrls.js';
import getRanking from '../Utils/CalculateRanking.js';
import { verifyPassword } from '../Utils/VerifyPassword.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { deletionList } from '../Utils/CloudinaryUtils.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function postImageService({ path }) {
  const result = await cloudinary.uploader.upload(path, {
    folder: 'team7_images',
  });
  fs.unlinkSync(path);
  return { imageUrl: result.secure_url }; // prettier-ignore
}

async function getRankingListService({ page, pageSize, rankBy }) {
  const styles = await prisma.style.findMany({
    select: {
      id: true,
      thumbnail: true,
      nickname: true,
      title: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      Curation: {
        select: {
          trendy: true,
          personality: true,
          practicality: true,
          costEffectiveness: true,
        },
      },
      tags: {
        select: {
          tagname: true,
        },
      },
    },
  });

  const transformedStyles = styles.map((style) => ({
    ...style,
    tags: style.tags.map((tag) => tag.tagname),
  }));

  const pagination = getRanking(rankBy, transformedStyles).slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const currentPage = page;
  // 검색 조건에 해당하는 전체 style의 수 조회
  const totalItemCount = styles.length;
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalItemCount / pageSize);
  const rankingList = {
    currentPage,
    totalPages,
    totalItemCount,
    data: pagination,
  };
  return rankingList;
}
// prettier-ignore
// 파라미터 기본 값 설정
async function getStyleListService({ page, pageSize, sortBy, searchBy, keyword, tag = null }) { 
  // 검색하려는 속성의 자료형이 그냥 문자열이면 contains, 배열이면 has를 써야함
  const searchByKeyword = searchBy === 'tag' ? 'tags' : searchBy;
  const where = {
    AND: [
      tag ? { tags: { some: { tagname: tag } } } : undefined,
      keyword
        ? {
            [searchByKeyword]:
              searchByKeyword === 'tags'
                ? { tags: { some: { tagname: { contains: keyword } } } }
                : { contains: keyword },
          }
        : undefined,
    ].filter(Boolean), // 검색 기준이 undefined면 삭제
  };

  // 정렬 기준 설정
  // 백엔드로 전달되는 값과 스키마의 컬럼명이 달라 switch 문으로 상황에 맞게 변경
  let orderBy = '';
  switch (sortBy) {
    case 'latest':
      orderBy = 'createdAt';
      break;
    case 'mostViewed':
      orderBy = 'viewCount';
      break;
    case 'mostCurated':
      orderBy = 'curationCount';
      break;
    default:
      orderBy = 'createdAt';
  }
  const styles = await prisma.style.findMany({
    where,
    select: {
      id: true,
      thumbnail: true,
      nickname: true,
      title: true,
      categories: true,
      content: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      tags: {
        select: {
          tagname: true,
        },
      },
    },
    orderBy: {
      [orderBy]: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const currentPage = page;
  // 검색 조건에 해당하는 전체 style의 수 조회
  const totalItemCount = await prisma.style.count({
    where,
  });
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalItemCount / pageSize);
  // res로 전달될 결과 객체
  const styleList = {
    currentPage,
    totalPages,
    totalItemCount,
    data: styles.map((style) => ({
      ...style,
      tags: style.tags.map((tag) => tag.tagname),
    })),
  };
  return styleList;
}

// 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
async function postStyleService({ imageUrls, Image, tags, ...data }) {
  // 기존태그 검색후 새로운 태그여야 생성하는 로직
  const tagConnectOrCreate = tags.map((tagName) => ({
    where: { tagname: tagName },
    create: { tagname: tagName },
  }));

  const style = await prisma.style.create({
    data: {
      ...data,
      Image: {
        create: Image,
      },
      tags: {
        connectOrCreate: tagConnectOrCreate,
      },
    },
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      categories: true,
      tags: {
        select: {
          id: true, // 태그 ID 선택
          tagname: true,
        },
      },
    },
  });

  // --- 인기 태그를 위한 새로운 로직 ---
  const tagIds = style.tags.map((tag) => tag.id);

  // 각 태그의 totalUsageCount 증가 (태그 사용할 때마다 1씩 증가)
  await prisma.tag.updateMany({
    where: {
      id: { in: tagIds },
    },
    data: {
      totalUsageCount: { increment: 1 },
    },
  });

  // 각 태그에 대한 TagUsageLog 항목 생성 (태그 사용할 때마다 시간 기록)
  const tagUsageLogEntries = tagIds.map((tagId) => ({ tagId }));
  await prisma.tagUsageLog.createMany({
    data: tagUsageLogEntries,
  });

  // res로 전달될 결과 객체
  // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
  const createdStyle = {
    ...style,
    imageUrls,
    tags: style.tags.map((tag) => tag.tagname),
  };
  return createdStyle;
}

async function getStyleService({ id }) {
  const style = await prisma.style.update({
    where: { id },
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      Image: {
        select: {
          url: true,
        },
      },
      tags: {
        select: {
          tagname: true,
        },
      },
    },
    data: {
      viewCount: { increment: 1 },
    },
  });
  // db에서 조회한 객체 형태의 Image를 imageUrls 배열로 변환
  const transformedStyle = {
    ...style,
    tags: style.tags.map((tag) => tag.tagname),
  };
  return imageToImageUrls(transformedStyle);
}
// prettier-ignore
// post와 동일한 전처리 과정들
// 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
async function putStyleService({id}, { imageUrls, Image, password, tags, ...data }) {
  // password는 업데이트에서 제외 -> 현재 단계에서는 비밀번호 변경 기능이 없음
  // 추후에 유저 기능을 추가한다면 newPassword, currentPassword 두가지로 비밀번호를 받아서
  // current로 인증을 하고 new비번으로 새로 해싱에서 저장하면 됨
  if (!(await verifyPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
    throw err;
  }

  const existingImages = await prisma.image.findMany({
    where: { styleId: id },
    select: { url: true },
  });

  const deletionPromises = deletionList(cloudinary, existingImages);

  await Promise.all(deletionPromises);

  // 기존 태그 가져오기
  const oldStyle = await prisma.style.findUnique({
    where: { id },
    select: {
      tags: {
        select: { id: true, tagname: true },
      },
    },
  });

  const oldTagIds = oldStyle.tags.map((tag) => tag.id);
  
  // 새로운 태그들을 찾거나 생성합니다.
  const tagResults = await prisma.tag.findMany({
    where: {
      tagname: {
        in: tags,
      },
    },
    select: { id: true, tagname: true },
  });

  const newTagIds = tagResults.map((tag => tag.id));

  // 새로 추가된 태그와 삭제된 태그를 계산합니다.
  const addedTagIds = newTagIds.filter((newId) => !oldTagIds.includes(newId));
  const removedTagIds = oldTagIds.filter((oldId) => !newTagIds.includes(oldId));

  // 삭제한 태그가 있을 경우 1씩 감소
  if (removedTagIds.length > 0) {
    await prisma.tag.updateMany({
      where: { id: { in: removedTagIds } },
      data: { totalUsageCount: { decrement: 1 } },
    });
  }

  // 기존태그 검색후 새로운 태그여야 생성하는 로직
  const tagConnectOrCreate = tags.map((tagName) => ({
    where: { tagname: tagName },
    create: { tagname: tagName },
  }));

  const style = await prisma.style.update({
    where: { id },
    data: {
      ...data,
      Image: {
        deleteMany: {},
        create: Image,
      },
       tags: {
        set: [], // 기존 연결을 모두 해제
        connectOrCreate: tagConnectOrCreate, // 새 태그 연결
      },
    },
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      tags: {
        select: {
          id: true, 
          tagname: true,
        },
      },
    },
  });

  // (태그 사용할 때마다 1씩 증가)
  if (addedTagIds.length > 0) {
    await prisma.tag.updateMany({
      where: {
        id: { in: addedTagIds },
      },
      data: {
        totalUsageCount: { increment: 1 },
      },
    });

  // 각 태그에 대한 TagUsageLog 항목 생성 (태그 사용할 때마다 시간 기록)
  const tagUsageLogEntries = tagIds.map(tagId => ({ tagId }));
  await prisma.tagUsageLog.createMany({
    data: tagUsageLogEntries,
  });

  // res로 전달될 결과 객체
  // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
  const updatedStyle = {
    ...style,
    imageUrls,
    tags: style.tags.map((tag) => tag.tagname),
  };
  return updatedStyle;
}}

async function deleteStyleService({ id }, { password }) {
  if (!(await verifyPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
    throw err;
  }

  const existingImages = await prisma.image.findMany({
    where: { styleId: id },
    select: { url: true },
  });

  const delectionPromises = deletionList(cloudinary, existingImages);

  await Promise.all(delectionPromises);

  // 삭제한 스타일의 태그 id 가져오기
  const styleToDelete = await prisma.style.findUnique({
    where: { id },
    select: {
      tags: {
        select: { id: true },
      },
    },
  });
  // 삭제한 태그 1씩 감소
  if (styleToDelete && styleToDelete.tags.length > 0) {
    const tagIdsToDecrement = styleToDelete.tags.map((tag) => tag.id);
    await prisma.tag.updateMany({
      where: { id: { in: tagIdsToDecrement } },
      data: { totalUsageCount: { decrement: 1 } },
    });
  }

  await prisma.style.delete({
    where: {
      id,
    },
  });
  return { message: '스타일 삭제 성공' };
}

export { getStyleListService, getStyleService, postStyleService, putStyleService, deleteStyleService, getRankingListService,  postImageService }; // prettier-ignore
