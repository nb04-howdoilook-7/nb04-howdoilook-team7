import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCurationList() {
  return async (req, res) => {
    // prettier-ignore
    const {page = '1', pageSize = '10', searchBy, keyword } = req.query;
    const styleId = parseInt(req.params.id);

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

    res
      .status(200)
      .json({ currentPage, totalPages, totalItemCount, data: curationList });
  };
}

function postCuration() {
  return async (req, res) => {
    const styleId = parseInt(req.params.id);
    // prettier-ignore
    const { nickname, password, content, trendy,
      personality, practicality, costEffectiveness } = req.body;

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

    res.status(201).json(postedCuration);
  };
}

function putCuration() {
  return async (req, res) => {
    const id = parseInt(req.params.id);
    // prettier-ignore
    const { nickname, content, password, trendy,
      personality, practicality, costEffectiveness } = req.body;

    const existingCuration = await prisma.curation.findUnique({
      where: { id },
    });

    if (!existingCuration) {
      throw new Error('존재하지 않는 큐레이션입니다.');
    }

    if (existingCuration.password !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
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

    res.status(200).json(updatedCuration);
  };
}

function deleteCuration() {
  return async (req, res) => {
    const id = parseInt(req.params.id);
    const { password } = req.body;

    const existingCuration = await prisma.curation.findUnique({
      where: { id },
    });

    if (!existingCuration) {
      throw new Error('존재하지 않는 큐레이션입니다.');
    }

    if (existingCuration.password !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    await prisma.curation.delete({
      where: { id },
    });
    res.status(200).json({ success: '큐레이션 삭제 성공' });
  };
}

export { getCurationList, postCuration, putCuration, deleteCuration };
