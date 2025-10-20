import { Prisma } from '@prisma/client';
import type {
  DeleteCuration,
  GetCurationList,
  PostCuration,
  PutCuration,
} from '../types/curations.types.js';
import { ConflictError, ForbiddenError } from '../Libs/errors.js';
import prisma from '../Libs/prisma.js';

// prettier-ignore
async function getCurationListService({ styleId, page, pageSize, searchBy, keyword }: GetCurationList) {
    const where: Prisma.CurationWhereInput = { styleId };
    if (keyword && searchBy) {
      if (searchBy === 'nickname') {
        where['user'] = { // 'nickname'은 user 객체 안에 있습니다.
          nickname: {
            contains: keyword,
            mode: 'insensitive',
          },
        };
      } else if (searchBy === 'content') {
        where['content'] = { // 'content'는 최상위 속성입니다.
          contains: keyword,
          mode: 'insensitive',
        };
      }
    }

    const take = pageSize || 10;
    const currentPage = Math.max(page || 1, 1);
    const skip = (currentPage - 1) * take;
    const totalItemCount = await prisma.curation.count({ where });
    const totalPages = Math.ceil(totalItemCount / take);

    const curationList = await prisma.curation.findMany({
      select: {
        id: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            nickname: true,
            profileImage: true,
          },
        },
        style: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                nickname: true,
                profileImage: true,
              },
            },
          },
        },
      },
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return { currentPage, totalPages, totalItemCount, data: curationList };
  }
// prettier-ignore
async function postCurationService({userId, styleId, content, trendy, personality, practicality, costEffectiveness,}: PostCuration) {
  const existingCuration = await prisma.curation.findFirst({
    where: {
      styleId,
      userId,
    },
  });

  if (existingCuration) {
    throw new ConflictError('해당 스타일에 이미 큐레이션을 등록한 사용자입니다.');
  }

  const postedCuration = await prisma.curation.create({
    // prettier-ignore
    data: { userId, styleId, content, trendy, personality, practicality, costEffectiveness },
    select: {
      id: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true,
      user: {
        select: {
          profileImage: true,
        },
      },
    },
  });

  await prisma.style.update({
    where: { id: styleId },
    data: { curationCount: { increment: 1 } },
  });
  return postedCuration;
}
// prettier-ignore
async function putCurationService({curationId, content, trendy, personality, practicality, costEffectiveness,}: PutCuration) {
  const _existingCuration = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId },
  });

  const updatedCuration = await prisma.curation.update({
    where: { id: curationId },
    // prettier-ignore
    data: { content, trendy, personality, practicality, costEffectiveness },
    select: {
      id: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true,
      user: {
        select: {
          profileImage: true,
        },
      },
    },
  });
  return updatedCuration;
}

async function deleteCurationService({ userId, curationId }: DeleteCuration) {
  const existingCuration = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId },
  });

  if (existingCuration.userId !== userId) {
    throw new ForbiddenError('삭제할 권한이 없습니다.');
  }

  await prisma.curation.delete({
    where: { id: curationId },
  });

  const styleId = existingCuration.styleId;
  await prisma.style.update({
    where: { id: styleId },
    data: { curationCount: { decrement: 1 } },
  });
  return { success: '큐레이션 삭제 성공' };
}
// prettier-ignore
export { getCurationListService, postCurationService, putCurationService, deleteCurationService, };
