import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getStyleList() {
  return async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 5,
        sortBy = 'latest',
        searchBy = 'nickname',
        keyword = '',
        tag = '',
      } = req.query;
      const where =
        tag !== ''
          ? {
              tags: { contains: tag },
            }
          : {
              [searchBy]: { contains: keyword },
            };
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
          nickname: true,
          title: true,
          tags: true,
          categories: true,
          content: true,
          viewCount: true,
          curationCount: true,
          createdAt: true,
          Image: {
            take: 1,
            orderBy: { id: 'asc' },
            select: {
              url: true,
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
      const totalItemCount = await prisma.style.count({
        where,
      });
      const totalPages = Math.ceil(totalItemCount / pageSize);
      const styleWithThumbnail = styles.map(({ Image, ...style }) => ({
        ...style,
        thumbnail: Image[0].url || null,
      }));
      const styleList = {
        currentPage,
        totalPages,
        totalItemCount,
        data: styleWithThumbnail,
      };
      res.status(200).json(styleList);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function categoryFilter(keyword) {
  return Object.fromEntries(
    Object.entries(keyword).filter(([key, val]) => {
      return val !== null && Object.keys(val).length > 0;
    }),
  );
}

function postStyle() {
  return async (req, res) => {
    try {
      const { imageUrls = [], ...data } = req.body;
      const Image = imageUrls.map(url => ({url})); // prettier-ignore
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
      style.categories = categoryFilter(style.categories);
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
      const id = parseInt(req.params.id);
      const style = await prisma.style.findUniqueOrThrow({
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
      });
      style.imageUrls = style.Image.map((image) => image.url);
      delete style.Image;
      style.categories = categoryFilter(style.categories);
      res.status(200).json(style);
    } catch (e) {
      console.error(e);
      if (e.code === 'P2025') {
        res.status(404).json({ error: 'id를 찾을 수 없습니다' }); // prettier-ignore
      }
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function putStyle() {
  return async (req, res) => {
    try {
      const { imageUrls = [], ...data } = req.body;
      const Image = imageUrls.map(url => ({url})); // prettier-ignore
      const id = parseInt(req.params.id);
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
          Image: {
            select: {
              url: true,
            },
          },
        },
      });
      style.imageUrls = style.Image.map((image) => image.url);
      delete style.Image;
      style.categories = categoryFilter(style.categories);
      res.status(200).json(style);
    } catch (e) {
      console.error(e);
      if (e.code === 'P2025') {
        res.status(404).json({ error: 'id를 찾을 수 없습니다' }); // prettier-ignore
      }
      res.status(500).json({ error: 'server error!' });
    }
  };
}

function deleteStyle() {
  return async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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

export { getStyleList, getStyle, postStyle, putStyle, deleteStyle };
