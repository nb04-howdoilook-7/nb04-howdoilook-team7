import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// prettier-ignore
async function getCurationListService(styleId, { page = '1', pageSize = '10', searchBy, keyword }) {
    const where = { styleId };
    if (keyword && (searchBy === 'nickname' || searchBy === 'content')) {
      where[searchBy] = { contains: keyword, mode: 'insensitive' };
    }

    const take = parseInt(pageSize, 10) || 10;
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
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
async function postCurationService(userId, styleId, 
  { content, trendy, personality, practicality, costEffectiveness,}) {
  const existingCuration = await prisma.curation.findFirst({
    where: {
      styleId,
      userId,
    },
  });

  if (existingCuration) {
    throw new Error('해당 스타일에 이미 큐레이션을 등록한 사용자입니다.');
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
    },
  });

  await prisma.style.update({
    where: { id: styleId },
    data: { curationCount: { increment: 1 } },
  });
  return postedCuration;
}
// prettier-ignore
async function putCurationService(userId, id,
  { content, trendy, personality, practicality, costEffectiveness,}) {
  const existingCuration = await prisma.curation.findUniqueOrThrow({
    where: { id },
  });

  const updatedCuration = await prisma.curation.update({
    where: { id },
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
    },
  });
  return updatedCuration;
}

async function deleteCurationService(userId, id) {
  const existingCuration = await prisma.curation.findUniqueOrThrow({
    where: { id },
  });

  if (existingCuration.userId !== userId) {
    const err = new Error('삭제할 권한이 없습니다.');
    err.statusCode = 403;
    throw err;
  }

  await prisma.curation.delete({
    where: { id },
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
