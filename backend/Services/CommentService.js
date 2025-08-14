import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//답글의 존재 여부와 비밀번호 일치 여부를 확인하는 헬퍼 함수입니다.
async function verifyCommentAndUser(id, password) {
  if (!id) {
    throw new Error('유효하지 않은 답글 ID입니다.'); //에러 핸들러 만들면 연결
  }
  if (!password) {
    throw new Error('비밀번호를 입력하세요.'); //에러 핸들러 만들면 연결
  }
  //id 존재 확인
  const commentData = await prisma.comment.findUnique({
    where: { id },
  });
  if (!commentData) {
    throw new Error('존재하지 않은 답글입니다.'); //에러 핸들러 만들면 연결
  }

  //비밀번호 일치 확인
  //실제 서비스에서는 비밀번호를 해싱하여 저장하고, bcrypt와 같은 라이브러리를 사용해 비교해야 합니다.
  //예시: await bcrypt.compare(password, commentData.password)
  if (commentData.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.'); //에러 핸들러 만들면 연결
  }

  return commentData;
}
//post 함수 입니다.
function postComment() {
  return async (req, res) => {
    try {
      const curationId = parseInt(req.params.id, 10);
      const { password, content } = req.body;

      if (!curationId) {
        throw new Error('유효하지 않은 큐레이션 ID입니다.'); //에러 핸들러 만들면 연결
      }

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

      //비밀번호 일치 확인
      if (curationData.style.password !== password) {
        throw new Error('비밀번호가 일치하지 않습니다.'); //에러 핸들러 만들면 연결
      }

      //답글 내용이 비어 있는지 확인
      if (!content) {
        throw new Error('답글 내용을 작성하세요.'); //에러 핸들러 만들면 연결
      }

      //모든 검증 통과후 답글 생성
      const comment = await prisma.comment.create({
        data: {
          curationId,
          nickname,
          password,
          content,
        },
      });
      res.json(comment);
    } catch (error) {
      console.error('답글 생성중에 오류가 발생했습니다.', error);
      throw error;
    }
  };
}
//put 함수 입니다.
function putComment() {
  return async (req, res) => {
    try {
      const { id } = parseInt(req.params, 10);
      const { password, content } = req.body;
      //헬퍼 함수 연결
      await verifyCommentAndUser(id, password);

      //답글 내용이 비어 있는지 확인
      if (!content) {
        throw new Error('수정할 내용이 없습니다.'); //에러 핸들러 만들면 연결
      }

      //모든 검증 통과후 답글 수정
      const comment = await prisma.comment.update({
        where: { id },
        data: { content },
      });
      res.json(comment);
    } catch (error) {
      console.error('답글 수정중에 오류가 발생했습니다.', error);
      throw error;
    }
  };
}
//delete 함수 입니다.
function deleteComment() {
  return async (req, res) => {
    try {
      const { id } = parseInt(req.params, 10);
      const { password } = req.body;
      //헬퍼 함수 연결
      await verifyCommentAndUser(id, password);

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

export { postComment, putComment, deleteComment };
