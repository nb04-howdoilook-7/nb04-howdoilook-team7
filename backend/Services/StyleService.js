import { PrismaClient } from '@prisma/client';
import imageToImageUrls from '../Utils/ImageToImageUrls.js';
import getRanking from '../Utils/CalculateRanking.js';
import { verifyPassword } from '../Utils/VerifyPassword.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { deletionList } from '../Utils/CloudinaryUtils.js';
import { connect } from 'http2';

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

async function getTagsService() {
  const tags = await prisma.style.findMany({
    select: {
      tags: true,
    },
  });
  // 중복된 태그들을 한 개만 남기기위한 형변환 -> set의 특성 활용
  const tagSet = new Set(tags.flatMap((items) => items.tags));
  const tagList = [...tagSet];
  return { tags: tagList };
}

async function getRankingListService({ page, pageSize, rankBy }) {
  const styles = await prisma.style.findMany({
    select: {
      id: true,
      thumbnail: true,
      title: true,
      tags: true,
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
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
  const pagination = getRanking(rankBy, styles).slice(
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
      tag ? { tags: { has: tag } } : undefined,
      keyword
        ? {
            [searchByKeyword]:
              searchByKeyword === 'tags'
                ? { has: keyword }
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
      title: true,
      tags: true,
      categories: true,
      content: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
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
    data: styles,
  };
  return styleList;
}

// 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
async function postStyleService(userId, { imageUrls, Image, ...data }) {
  const style = await prisma.style.create({
    data: {
      ...data,
      Image: {
        create: Image,
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      categories: true,
      tags: true,
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
  // res로 전달될 결과 객체
  // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
  const createdStyle = {
    ...style,
    imageUrls,
  };
  return createdStyle;
}

async function getStyleService({ id }) {
  const style = await prisma.style.update({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      Image: {
        select: {
          url: true,
        },
      },
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
    data: {
      viewCount: { increment: 1 },
    },
  });
  // db에서 조회한 객체 형태의 Image를 imageUrls 배열로 변환
  return imageToImageUrls(style);
}
// prettier-ignore
// post와 동일한 전처리 과정들
// 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
async function putStyleService({id}, { imageUrls, Image, ...data }) {
  const existingImages = await prisma.image.findMany({
    where: { styleId: id },
    select: { url: true },
  });

  const deletionPromises = deletionList(cloudinary, existingImages);

  await Promise.all(deletionPromises);

  const style = await prisma.style.update({
    where: { id },
    data: {
      ...data,
      Image: {
        deleteMany: {},
        create: Image,
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      categories: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
  // res로 전달될 결과 객체
  // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
  const updatedStyle = {
    ...style,
    imageUrls,
  };
  return updatedStyle;
}

async function deleteStyleService({ id }) {
  const existingImages = await prisma.image.findMany({
    where: { styleId: id },
    select: { url: true },
  });

  const delectionPromises = deletionList(cloudinary, existingImages);

  await Promise.all(delectionPromises);

  await prisma.style.delete({
    where: {
      id,
    },
  });
  return { message: '스타일 삭제 성공' };
}

export { getStyleListService, getStyleService, postStyleService, putStyleService, deleteStyleService, getRankingListService, getTagsService, postImageService }; // prettier-ignore
