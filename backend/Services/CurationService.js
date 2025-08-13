import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCurationList() {
  return async (req, res) => {
    // prettier-ignore
    const {page = '1', pageSize = '10', searchBy, keyword } = req.query;

    const styleId = req.params.id;
    // const styleId = Number(req.params.id);
    const where = { styleId };
    if (keyword && (searchBy === 'nickname' || searchBy === 'content')) {
      where[searchBy] = { contains: keyword, mode: 'insensitive' };
    }

    const take = parseInt(pageSize, 10) || 10;
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (p - 1) * take;

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
      },
      where,
      skip,
      take,
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(curationList);
  };
}

function postCuration() {
  return async (req, res) => {
    const styleId = req.params.id;
    // const styleId = Number(req.params.id);
    // prettier-ignore
    const { nickname, password, content, trendy,
      personality, practicality, costEffectiveness } = req.body;

    const postedCuration = await prisma.curation.create({
      // prettier-ignore
      data: { styleId, nickname, password, content, trendy, personality,
        practicality, costEffectiveness },
    });

    res.status(201).json(postedCuration);
  };
}

function putCuration() {
  return async (req, res) => {
    const id = req.params.id;
    //const id = Number(req.params.id);
    // prettier-ignore
    const { nickname, content, password, trendy,
      personality, practicality, costEffectiveness } = req.body;

    const existingCuration = await prisma.curation.findUniqueOrThrow({
      where: { id },
    });

    if (existingCuration.password !== password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const updatedCuration = await prisma.curation.update({
      where: { id },
      // prettier-ignore
      data: { nickname, content, trendy, personality,
        practicality, costEffectiveness },
    });

    res.status(200).json(updatedCuration);
  };
}

function deleteCuration() {
  return async (req, res) => {
    const id = req.params.id;
    await prisma.curation.delete({
      where: { id },
    });
    res.status(200).json({ success: '큐레이션 삭제 성공' });
  };
}

export { getCurationList, postCuration, putCuration, deleteCuration };
