import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 태그 목록 조회
export async function getTagsService() {
  const tags = await prisma.tag.findMany({
    select: {
      tagname: true,
    },
  });
  // 중복된 태그들을 한 개만 남기기위한 형변환 -> set의 특성 활용
  const tagSet = new Set(tags.map((tag) => tag.tagname));
  const tagList = [...tagSet];
  return { tags: tagList };
}
