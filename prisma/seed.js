require('dotenv').config();
const prisma = require('../src/lib/prisma');

async function main() {
  // 정리
  await prisma.comment.deleteMany();
  await prisma.curation.deleteMany();
  await prisma.image.deleteMany();
  await prisma.style.deleteMany();
  await prisma.user.deleteMany();

  // 1) 유저 생성 (평문/학습용 — 운영시 bcrypt 해시로)
  const u1 = await prisma.user.create({
    data: { nickname: 'jay_user', password: 'u1111' }
  });
  const u2 = await prisma.user.create({
    data: { nickname: 'mia_user', password: 'u2222' }
  });

  // 2) 스타일 생성(기존과 동일 + userId 연결)
  const s1 = await prisma.style.create({
    data: {
      userId: u1.id,                      // 연결
      nickname: 'jay',
      password: '1111',
      title: '여름 미니멀 출근룩',
      content: '린넨 셔츠 + 슬랙스 + 로퍼',
      categories: {
        top: { name: '린넨 셔츠', brand: 'MUS', price: 49000 },
        bottom: { name: '쿨 슬랙스', brand: 'Uni', price: 59000 },
        shoes: { name: '로퍼', brand: 'DrM', price: 129000 }
      },
      tags: ['미니멀', '포멀'],
      Image: {
        create: [
          { url: 'https://picsum.photos/seed/minimal1/900/1200' },
          { url: 'https://picsum.photos/seed/minimal2/900/1200' }
        ]
      }
    }
  });

  const s2 = await prisma.style.create({
    data: {
      userId: u2.id,                      // ← 연결
      nickname: 'mia',
      password: '2222',
      title: '스트릿 데이트룩',
      content: '그래픽 티 + 카고 + 조던',
      categories: {
        top: { name: '그래픽 티', brand: 'Sup', price: 99000 },
        bottom: { name: '카고 팬츠', brand: 'Car', price: 89000 },
        shoes: { name: '조던1', brand: 'Nike', price: 199000 },
        bag: { name: '크로스백', brand: 'Hers', price: 79000 }
      },
      tags: ['스트릿', '캐주얼'],
      Image: { create: [{ url: 'https://picsum.photos/seed/street1/900/1200' }] }
    }
  });

  // 3) 큐레이팅(하나는 유저 연결, 하나는 익명) — 두 규칙 공존 테스트
  await prisma.curation.create({
    data: {
      styleId: s1.id,
      userId: u2.id,                      // ← 유저가 남긴 큐레이팅
      nickname: 'raterA',
      password: '3333',
      content: '!',
      trendy: 5, personality: 3, practicality: 5, costEffectiveness: 4
    }
  });

  await prisma.curation.create({
    data: {
      styleId: s1.id,
      // userId 없이 닉네임/비번만 v1 방식(익명)
      nickname: 'raterB',
      password: '4444',
      content: '가격 대비 좋아요',
      trendy: 4, personality: 3, practicality: 4, costEffectiveness: 5,
      comments: {
        create: {
          userId: u1.id,                  // 스타일 소유자 연결
          nickname: s1.nickname,
          password: s1.password,          // v1 규칙 유지: 스타일 비번과 일치
          content: '칭찬 고마워요 🙌'
        }
      }
    }
  });

  await prisma.style.update({ where: { id: s1.id }, data: { curationCount: 2 } });

  // s2에도 2개
  await prisma.curation.create({
    data: {
      styleId: s2.id,
      userId: u1.id,
      nickname: 'raterC',
      password: '3333',
      content: '좋아요',
      trendy: 4, personality: 4, practicality: 3, costEffectiveness: 4
    }
  });
  await prisma.curation.create({
    data: {
      styleId: s2.id,
      nickname: 'raterD',
      password: '4444',
      content: '굿',
      trendy: 5, personality: 4, practicality: 4, costEffectiveness: 4
    }
  });
  await prisma.style.update({ where: { id: s2.id }, data: { curationCount: 2 } });

  console.log('Seeding complete (with users)');
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());