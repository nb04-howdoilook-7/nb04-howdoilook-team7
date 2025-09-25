import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// prettier-ignore
async function verifyPassword(id, inputPassword) { 
    const style = await prisma.style.findUniqueOrThrow({
        where: {id},
        select: {
            password: true,
        }
    })
    // 비교 대상 password는 평문 이어야함
    // inputPassword -> 평문
    // style.password -> db에 저장된 해시
    const isMatch = await bcrypt.compare(inputPassword, style.password);
    return isMatch;
}

async function verifyCurationPassword(id, inputPassword) {
  const curation = await prisma.curation.findUniqueOrThrow({
    where: { id },
    select: {
      password: true,
    },
  });

  const isMatch = await bcrypt.compare(inputPassword, curation.password);
  return isMatch;
}

async function verifyCommentPassword(id, password) {
  //id 존재 확인
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id },
    select: {
      password: true,
    },
  });

  const isMatch = await bcrypt.compare(password, comment.password);
  return isMatch;
}

export { verifyPassword, verifyCurationPassword, verifyCommentPassword };
