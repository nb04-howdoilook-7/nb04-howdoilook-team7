import { z } from 'zod';

//유효성 검사 미들웨어 로직
const validate = (schemas) => (req, res, next) => {
  try {
    //body 검사
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    //params 검사
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }

    //query 검사
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }

    next();
  } catch (error) {
    //유효성 검사 실패 시 400 Bad Request 응답
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '유효성 검사 오류',
        errors: error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    //기타 예상치 못한 에러 처리
    next(error);
  }
};

//공통 id, password, content (중복 제거)
const idSchema = z
  .string()
  .regex(/^\d+$/, 'ID는 숫자만 포함해야 합니다.')
  .transform((val) => parseInt(val, 10)) //숫자로 변환
  .refine((val) => val > 0, { message: '유효하지 않은 답글 ID 형식입니다.' });
const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.');
const contentSchema = z
  .string()
  .min(1, { message: '답글 내용을 작성하세요.' })
  .max(500, { message: '답글 내용은 500자를 초과할 수 없습니다.' });

//post 함수 (body + params)
const postComment = {
  params: z
    .object({
      curationId: idSchema,
    })
    .strict(),
  body: z
    .object({
      password: passwordSchema,
      content: contentSchema,
    })
    .strict(),
};

//put 함수 (body + params)
const putComment = {
  params: z
    .object({
      id: idSchema,
    })
    .strict(),
  body: z
    .object({
      password: passwordSchema,
      content: contentSchema,
    })
    .strict(),
};

//delete 함수
const deleteComment = {
  params: z
    .object({
      id: idSchema,
    })
    .strict(),
  body: z
    .object({
      password: passwordSchema,
    })
    .strict(),
};

export const validatePostComment = validate(postComment);
export const validatePutComment = validate(putComment);
export const validateDeleteComment = validate(deleteComment);
