import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { verifyCommentPassword } from '../Utils/VerifyPassword.js';

const prisma = new PrismaClient();

//공통 select (중복 제거)
const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
};

// prettier-ignore
//post 함수
export async function postCommentService({ curationId }, { password, content },) {
  //큐레이션 id 존재 확인
  const curationData = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId },
    include: { style: true },
  });

  //스타일에서 닉네임 가져오기
  if (!curationData.style) {
    throw new Error('해당 큐레이션에 스타일 정보가 존재하지 않습니다.'); //에러 핸들러 만들면 연결
  }
  const nickname = curationData.style.nickname;
  const stylePasswordHash = curationData.style.password;

  //비밀번호 일치 확인
  const isMatch = await bcrypt.compare(password, stylePasswordHash);
  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.'); //에러 핸들러 만들면 연결
  }

  //comment 비밀번호 해시 처리
  const hashedPassword = await bcrypt.hash(password, 10);

  //모든 검증 통과후 답글 생성
  const comment = await prisma.comment.create({
    data: {
      curationId,
      password: hashedPassword,
      content,
    },
    select: commentSelect,
  });
  return comment;
}
//put 함수
export async function putCommentService({ id }, { password, content }) {
  if (!(await verifyCommentPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
    throw err;
  }

  //모든 검증 통과후 답글 수정
  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
    select: commentSelect,
  });
  return comment;
}

//delete 함수
export async function deleteCommentService({ id }, { password }) {
  if (!(await verifyCommentPassword(id, password))) {
    const err = new Error('비밀번호가 일치하지 않습니다');
    err.statusCode = 401;
    throw err;
  }

  //모든 검증 통과후 답글 삭제
  await prisma.comment.delete({
    where: { id },
  });
  return { message: '답글 삭제 성공' };
}
