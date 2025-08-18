/**
 * Seed (v1)
 * - 테이블 정리 후 샘플 데이터 삽입 (Style 2, Curation 4, Comment 1)
 * - 실행:
 *   npx prisma generate --schema backend/prisma/schema.prisma
 *   npx prisma db push  --schema backend/prisma/schema.prisma
 *   node backend/Seeds/Seed.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // FK 순서로 클리어
  await prisma.comment.deleteMany();
  await prisma.curation.deleteMany();
  await prisma.image.deleteMany();
  await prisma.style.deleteMany();

  const s1 = await prisma.style.create({
    data: {
      nickname: '정승우',
      password: '1234',
      title: '가을 패션!',
      content: '가을 바지 + 가을신발, 가을 겉옷',
      categories: {
        top: { name: '가을 바지', brand: 'MUS', price: 50000 },
        bottom: { name: '가을 신발', brand: 'Uni', price: 60000 },
        shoes: { name: '가을 겉옷', brand: 'DrM', price: 200000 },
      },
      tags: ['단풍', '가을'],
      Image: {
        create: [
          { url: 'https://picsum.photos/seed/minimal1/900/1200' },
          { url: 'https://picsum.photos/seed/minimal2/900/1200' },
        ],
      },
    },
  });

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
      comments: {
        create: {
          nickname: s1.nickname,
          password: s1.password,
          content: 'ㅎㅎㅎ',
        },
      },
    },
  });

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

  await prisma.style.update({ where: { id: s1.id }, data: { curationCount: 2 } });
  await prisma.style.update({ where: { id: s2.id }, data: { curationCount: 2 } });

  console.log('✅ Seeding complete (v1)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
