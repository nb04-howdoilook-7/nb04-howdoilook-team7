import { PrismaClient } from '@prisma/client';
import imageToImageUrls from '../Utils/ImageToImageUrls.js';
import getRanking from '../Utils/CalculateRanking.js';
import { verifyPassword } from '../Utils/VerifyPassword.js';

const prisma = new PrismaClient();

function getRankingList() {
  return async (req, res) => {
    try {
      const { page, pageSize, rankBy } = req.parsedQuery;
      const styles = await prisma.style.findMany({
        select: {
          id: true,
          thumbnail: true,
          nickname: true,
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
      res.status(200).send(rankingList);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function getStyleList() {
  return async (req, res) => {
    try {
      // 파라미터 기본 값 설정
      const { page, pageSize, sortBy, searchBy, keyword, tag = null } = req.parsedQuery; // prettier-ignore
      // 파라미터로 tag가 전달될 경우 태그로 검색
      // 검색 기준이 전달될 경우 검색 기준의 검색 키워드로 검색
      const where =
        tag !== null
          ? {
              tags: { has: tag },
            }
          : {
              [searchBy]: { contains: keyword },
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
          tags: true,
          categories: true,
          content: true,
          viewCount: true,
          curationCount: true,
          createdAt: true,
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
      res.status(200).json(styleList);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function postStyle() {
  return async (req, res) => {
    try {
      // 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
      const { imageUrls, Image, ...data } = req.body;
      const style = await prisma.style.create({
        data: {
          ...data,
          Image: {
            create: Image,
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
          tags: true,
        },
      });
      // res로 전달될 결과 객체
      // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
      const createdStyle = {
        ...style,
        imageUrls,
      };
      res.status(201).json(createdStyle);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function getStyle() {
  return async (req, res) => {
    try {
      const { id } = req.parsedId;
      const style = await prisma.style.update({
        where: { id },
        select: {
          id: true,
          nickname: true,
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
        },
        data: {
          viewCount: { increment: 1 },
        },
      });
      // db에서 조회한 객체 형태의 Image를 imageUrls 배열로 변환
      res.status(200).json(imageToImageUrls(style));
    } catch (e) {
      console.error(e);
      if (e.code === 'P2025') {
        return res.status(404).json({ error: 'id를 찾을 수 없습니다' }); // prettier-ignore
      }
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function putStyle() {
  return async (req, res) => {
    try {
      // post와 동일한 전처리 과정들
      // 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
      const { imageUrls, Image, password, ...data } = req.body;
      const { id } = req.parsedId;
      // password는 업데이트에서 제외 -> 현재 단계에서는 비밀번호 변경 기능이 없음
      // 추후에 유저 기능을 추가한다면 newPassword, currentPassword 두가지로 비밀번호를 받아서
      // current로 인증을 하고 new비번으로 새로 해싱에서 저장하면 됨
      if (!(await verifyPassword(id, password))) {
        return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
      }
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
          nickname: true,
          title: true,
          content: true,
          tags: true,
          categories: true,
          viewCount: true,
          curationCount: true,
          createdAt: true,
        },
      });
      // res로 전달될 결과 객체
      // db에만 Image로 저장되고 사용자에겐 다시 imageUrls
      const updatedStyle = {
        ...style,
        imageUrls,
      };
      res.status(200).json(updatedStyle);
    } catch (e) {
      console.error(e);
      if (e.code === 'P2025') {
        return res.status(404).json({ error: 'id를 찾을 수 없습니다' }); // prettier-ignore
      }
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function deleteStyle() {
  return async (req, res) => {
    try {
      const { id } = req.parsedId;
      const { password } = req.body;
      if (!(await verifyPassword(id, password))) {
        return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
      }
      const style = await prisma.style.delete({
        where: {
          id,
        },
      });
      res.status(200).json({ message: '스타일 삭제 성공' });
    } catch (e) {
      console.error(e);
      if (e.code === 'P2025') {
        return res.status(404).json({ message: '존재하지 않습니다.' }); // prettier-ignore
      }
      res.status(500).json({ error: 'server error!' });
    }
  };
}

export { getStyleList, getStyle, postStyle, putStyle, deleteStyle, getRankingList }; // prettier-ignore
