import { z } from 'zod';

//comment 생성
const createCommentSchema = z.object({
  password: z.string(),
  content: z
    .string()
    .min(1, { message: '답글 내용을 작성하세요.' })
    .max(500, { message: '답글 내용은 500자를 초과할 수 없습니다.' }),
});
//comment 수정
const updateCommentSchema = createCommentSchema.partial();

//id 유효성 검사
const commentIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10)) //숫자로 변환
    .pipe(
      z
        .number()
        .int()
        .positive({ message: '유효하지 않은 답글 ID 형식입니다.' }),
    ),
});

//curationId 유효성 검사
const curationIdSchema = z.object({
  curationId: z
    .string()
    .transform((val) => parseInt(val, 10)) //숫자로 변환
    .pipe(
      z
        .number()
        .int()
        .positive({ message: '유효하지 않은 큐레이션 ID 형식입니다.' }),
    ),
});

//유효성 검사를 미들웨어로 만들기 위한 로직
const validate =
  (schema, property = 'body') =>
  (req, res, next) => {
    try {
      // 스키마에 맞춰 요청 데이터를 파싱하여 유효성 검사
      schema.parse(req[property]);
      next(); // 유효성 검사 통과 시 다음 미들웨어로 이동
    } catch (error) {
      // 유효성 검사 실패 시 400 Bad Request 응답
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: '유효성 검사 실패',
          errors: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      // 기타 예상치 못한 에러 처리
      next(error);
    }
  };

const validateCreateComment = validate(createCommentSchema);
const validateUpdateComment = validate(updateCommentSchema);
const validateCommentId = validate(commentIdSchema, 'params');
const validateCurationId = validate(curationIdSchema, 'params');

export {
  validateCreateComment,
  validateUpdateComment,
  validateCommentId,
  validateCurationId,
};
