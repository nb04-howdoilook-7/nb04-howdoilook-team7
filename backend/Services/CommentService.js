import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

//공통 select (중복 제거)
const commentSelect = {
  id: true,
  nickname: true,
  content: true,
  createdAt: true,
};

//답글의 존재 여부와 비밀번호 일치 여부를 확인하는 헬퍼 함수
async function verifyPasswordById(id, password) {
  //id 존재 확인
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment) {
    throw new Error('존재하지 않은 답글입니다.'); //에러 핸들러 만들면 연결
  }

  const isMatch = await bcrypt.compare(password, comment.password);
  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.'); //에러 핸들러 만들면 연결
  }
  return comment;
}

//post 함수
export function postComment() {
  return async (req, res) => {
    try {
      const { curationId } = req.params;
      const { password, content } = req.body;

      //큐레이션 id 존재 확인
      const curationData = await prisma.curation.findUnique({
        where: { id: curationId },
        include: { style: true },
      });
      if (!curationData) {
        throw new Error('존재하지 않은 큐레이션 입니다.'); //에러 핸들러 만들면 연결
      }

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
          nickname,
          password: hashedPassword,
          content,
        },
        select: commentSelect,
      });
      res.json(comment);
    } catch (error) {
      console.error('답글 생성중에 오류가 발생했습니다.', error);
      throw error;
    }
  };
}

//put 함수
export function putComment() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const { password, content } = req.body;
      //헬퍼 함수 연결
      await verifyPasswordById(id, password);

      //모든 검증 통과후 답글 수정
      const comment = await prisma.comment.update({
        where: { id },
        data: { content },
        select: commentSelect,
      });
      res.json(comment);
    } catch (error) {
      console.error('답글 수정중에 오류가 발생했습니다.', error);
      throw error;
    }
  };
}

//delete 함수
export function deleteComment() {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      //헬퍼 함수 연결
      await verifyPasswordById(id, password);

      //모든 검증 통과후 답글 삭제
      await prisma.comment.delete({
        where: { id },
      });
      res.json({ message: '답글 삭제 성공' });
    } catch (error) {
      console.error('답글 삭제중에 오류가 발생했습니다.', error);
      throw error;
    }
  };
}
