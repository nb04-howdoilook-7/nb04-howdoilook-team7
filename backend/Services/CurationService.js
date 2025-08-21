import { PrismaClient } from '@prisma/client';
import { verifyCurationPassword } from '../Utils/VerifyPassword.js';

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
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,

        comments: {
          select: {
            id: true,
            nickname: true,
            content: true,
            createdAt: true,
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
async function postCurationService(styleId, 
  { nickname, password, content, trendy, personality, practicality, costEffectiveness,}) {
  const existingCuration = await prisma.curation.findFirst({
    where: {
      styleId,
      nickname,
    },
  });

  if (existingCuration) {
    throw new Error('해당 스타일에 이미 큐레이션을 등록한 닉네임입니다.');
  }

  const postedCuration = await prisma.curation.create({
    // prettier-ignore
    data: { styleId, nickname, password, content, trendy, personality,
        practicality, costEffectiveness },
    select: {
      id: true,
      nickname: true,
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
async function putCurationService(id,
  { nickname, content, password, trendy, personality, practicality, costEffectiveness,}) {
  const existingCuration = await prisma.curation.findUnique({
    where: { id },
  });

  if (!existingCuration) {
    throw new Error('존재하지 않는 큐레이션입니다.');
  }

  if (!(await verifyCurationPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
    throw err;
  }

  const updatedCuration = await prisma.curation.update({
    where: { id },
    // prettier-ignore
    data: { nickname, content, trendy, personality,
        practicality, costEffectiveness },
    select: {
      id: true,
      nickname: true,
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

async function deleteCurationService(id, { password }) {
  const existingCuration = await prisma.curation.findUnique({
    where: { id },
  });

  if (!existingCuration) {
    throw new Error('존재하지 않는 큐레이션입니다.');
  }

  if (!(await verifyCurationPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
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
