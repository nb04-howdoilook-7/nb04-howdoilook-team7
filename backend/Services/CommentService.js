import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//공통 select (중복 제거)
const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  user: {
    select: {
      nickname: true,
    },
  },
};

//post 함수
export async function postCommentService(userId, { curationId }, { content }) {
  //큐레이션 id 존재 확인
  const curationData = await prisma.curation.findUniqueOrThrow({
    where: { id: curationId },
    select: {
      style: {
        select: {
          userId: true,
          user: {
            select: {
              profileImage: true,
            },
          },
        },
      },
    },
  });

  //스타일 id와 커멘트 id를 비교하여 같은 id만 작성가능
  if (userId !== curationData.style.userId) {
    throw new Error('스타일 작성자만 답글을 작성할 수 있습니다.');
  }

  //모든 검증 통과후 답글 생성
  const comment = await prisma.comment.create({
    data: {
      content,
      curationId,
      userId,
    },
    select: commentSelect,
  });
  return comment;
}
//put 함수
export async function putCommentService(userId, { id }, { content }) {
  //수정할 댓글을 찾고 작성자를 확인합니다.
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: { id },
  });

  //댓글이 존재하고, 요청한 사용자와 작성자가 같은지 확인
  if (!commentData || commentData.userId !== userId) {
    throw new Error('해당 답글을 수정할 권한이 없습니다.');
  }

  //모든 검증 통과후 답글 수정
  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
    select: {
      commentSelect,
      user: {
        select: {
          profileImage: true,
        },
      },
    },
  });
  return comment;
}

//delete 함수
export async function deleteCommentService(userId, { id }) {
  //삭제할 댓글을 찾고 작성자를 확인합니다.
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id },
  });

  //댓글이 존재하고, 요청한 사용자와 작성자가 같은지 확인
  if (!comment || comment.userId !== userId) {
    throw new Error('해당 답글을 삭제할 권한이 없습니다.');
  }

  //모든 검증 통과후 답글 삭제
  await prisma.comment.delete({
    where: { id },
  });
  return { message: '답글 삭제 성공' };
}
