import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function calculatePopularTags() {
  console.log('인기 태그 계산 작업 시작...');

  try {
    // 1. TagUsageLog 모델에서 태그의 주간 사용량(weeklyUsageCount) 계산
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 현재시간에서 7일시간 계산
    const weeklyUsages = await prisma.tagUsageLog.groupBy({
      by: ['tagId'],
      _count: {
        id: true,
      },
      where: {
        timestamp: {
          gte: sevenDaysAgo,
        },
      },
    });
    // weeklyUsages의 값 [{ tagId: 1, _count: { id: 10 } }]을 { 1: 10 } 이렇게 만들어줌
    const weeklyUsageMap = new Map();
    weeklyUsages.forEach((item) => {
      weeklyUsageMap.set(item.tagId, item._count.id);
    });

    // 2. 모든 태그를 가져와 인기도 점수(popularityScore) 계산
    const allTags = await prisma.tag.findMany();

    let maxTotalUsage = 0;
    let maxWeeklyUsage = 0;

    // 정규화를 위한 최대값 찾기
    allTags.forEach((tag) => {
      if (tag.totalUsageCount > maxTotalUsage) {
        maxTotalUsage = tag.totalUsageCount;
      }
      const currentWeeklyUsage = weeklyUsageMap.get(tag.id) || 0;
      if (currentWeeklyUsage > maxWeeklyUsage) {
        maxWeeklyUsage = currentWeeklyUsage;
      }
    });
    // 점수 계산 공식: 정규회된 총 태그 사용량 = 0 ~ 1 사이값
    // 정규화된 총 7일간 태그 사용량 = 0 ~ 1 사이값
    // (정규화된 총 태그 사용량 × 0.5) + (정규화된 7일간 태그 사용량 × 0.5)
    const updates = allTags.map((tag) => {
      const normalizedTotal =
        maxTotalUsage > 0 ? tag.totalUsageCount / maxTotalUsage : 0;
      const normalizedWeekly =
        maxWeeklyUsage > 0
          ? (weeklyUsageMap.get(tag.id) || 0) / maxWeeklyUsage
          : 0;

      const popularityScore = normalizedTotal * 0.5 + normalizedWeekly * 0.5;

      return prisma.tag.update({
        where: { id: tag.id },
        data: { popularityScore: parseFloat(popularityScore.toFixed(4)) }, // 소수점 4자리까지 저장
      });
    });
    // 트렌잭션을 사용하여 db와 일치화
    await prisma.$transaction(updates);
    console.log('인기도 점수가 성공적으로 업데이트되었습니다.');

    // 3. 오래된 TagUsageLog 항목 삭제 (오래된 태그를 삭제 함으로써 db최적화)
    const deleteResult = await prisma.tagUsageLog.deleteMany({
      where: {
        timestamp: {
          lt: sevenDaysAgo, // 7일보다 오래된 기록 삭제
        },
      },
    });
    console.log(
      `${deleteResult.count}개의 오래된 TagUsageLog 항목이 삭제되었습니다.`,
    );
  } catch (error) {
    console.error('인기 태그 계산 중 오류 발생:', error);
  }

  console.log('인기 태그 계산 작업 완료.');
}

export { calculatePopularTags };
