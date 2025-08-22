import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTagsService() {
  const popularTags = await prisma.tag.findMany({
    select: {
      tagname: true,
      popularityScore: true, // 정렬을 위해 popularityScore 선택
    },
    orderBy: {
      popularityScore: 'desc', // popularityScore를 기준으로 내림차순 정렬
    },
    take: 10, // 상위 10개만 가져오기
  });

  // 원래 함수가 반환했던 태그 이름 배열로 매핑
  const tagList = popularTags.map((tag) => tag.tagname);
  return { tags: tagList };
}
