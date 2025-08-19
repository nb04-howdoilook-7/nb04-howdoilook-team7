/**
 * 개발용 시드(Seed)
 * 재실행 안전 (idempotent)하도록 FK 역순 삭제 -> 샘플 생성 -> 파생값 업데이트 순서로 구성
 * 실행: node backend/Seeds/Seed.js
 */
require('dotenv').config(); // 루트 .env fhem (DATABASE_URL 등)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1) 기존 데이터 정리 (FK 역순)
  await prisma.comment.deleteMany();
  await prisma.curation.deleteMany();
  await prisma.image.deleteMany();
  await prisma.style.deleteMany();

  // 2) 샘플 Style 생성 (nested Image)
  const s1 = await prisma.style.create({
    data: {
      nickname: '정승우',
      password: '1234',
      title: '가을 패션!',
      content: '가을 바지 + 가을신발, 가을 겉옷',
      // 자유형 JSON: 카테고리/ 가격/ 브랜드 / 등을 유연 하게 담을 수 있도록
      categories: {
        top: { name: '가을 바지', brand: 'MUS', price: 50000 },
        bottom: { name: '가을 신발', brand: 'Uni', price: 60000 },
        shoes: { name: '가을 겉옷', brand: 'DrM', price: 200000 },
      },
      tags: ['단풍', '가을'],
      Image: {
        // 관계명 모델 정의에 따라 다릅니다.: Prisma는 필드명 기준 
        create: [
          { url: 'https://picsum.photos/seed/minimal1/900/1200' },
          { url: 'https://picsum.photos/seed/minimal2/900/1200' },
        ],
      },
    },
  });

  // Style 1에 대한 Curation 2건 (두 번째에 Comment 1건 포함)
  await prisma.curation.create({
    data: {
      styleId: s1.id,
      nickname: 'raterA',
      password: '3333',
      content: '가을 냄새 이빠이 풍깁니다.!',
      trendy: 5, personality: 3, practicality: 5, costEffectiveness: 4,
    },
  });

  await prisma.curation.create({
    data: {
      styleId: s1.id,
      nickname: 'raterB',
      password: '4444',
      content: '가격 대비 좋아요',
      trendy: 4, personality: 3, practicality: 4, costEffectiveness: 5,
      // Curation:Comment = 1대1 (스키마에 따라 필드명이 comments/Comment 동일 할 가능성 있습니다.)
      comments: {
        create: {
          // 정책 사항: 댓글 등록 비밀번호는 '스타일 비밀번호와 일치 해야 함'
          nickname: s1.nickname,
          password: s1.password,
          content: 'ㅎㅎㅎ',
        },
      },
    },
  });

  // 두번째 Style
  const s2 = await prisma.style.create({
    data: {
      nickname: 'mia',
      password: '2222',
      title: '스트릿 데이트룩',
      content: '그래픽 티 + 카고 + 조던',
      categories: {
        top: { name: '그래픽 티', brand: 'Sup', price: 99000 },
        bottom: { name: '카고 팬츠', brand: 'Car', price: 89000 },
        shoes: { name: '조던1', brand: 'Nike', price: 199000 },
        bag: { name: '크로스백', brand: 'Hers', price: 79000 },
      },
      tags: ['스트릿', '캐주얼'],
      Image: { create: [{ url: 'https://picsum.photos/seed/street1/900/1200' }] },
    },
  });

  await prisma.curation.create({
    data: {
      styleId: s2.id,
      nickname: 'raterC',
      password: '3333',
      content: '색조합이 좋아요',
      trendy: 4, personality: 4, practicality: 3, costEffectiveness: 4,
    },
  });
  await prisma.curation.create({
    data: {
      styleId: s2.id,
      nickname: 'raterD',
      password: '4444',
      content: '스니커즈 포인트 굿',
      trendy: 5, personality: 4, practicality: 4, costEffectiveness: 4,
    },
  });

  // 3번째 파싱값 업데이트 (큐레이팅 수) - 쿼리 로 계산해서 반영 가능 합니다.
  await prisma.style.update({ where: { id: s1.id }, data: { curationCount: 2 } });
  await prisma.style.update({ where: { id: s2.id }, data: { curationCount: 2 } });

  console.log('Seeding complete (v1)');
}

main().catch((e) => {
  // 전역 핸들러 적용 전 실행 되는 스크립트 라 여기서 로그 
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
