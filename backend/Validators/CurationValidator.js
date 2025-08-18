import { z } from 'zod';

const PostCurationSchema = z.object({
  nickname: z.string().min(1, '닉네임은 필수입니다.'),
  password: z.string().min(1, '비밀번호는 필수입니다.'),
  // 내용이 꼭 필수일 필요는 없을 것 같은데 일단 스키마에 맞춰 정의해두었습니다.
  content: z.string().min(1, '내용은 필수입니다.'),
  trendy: z.number().int().min(0).max(10),
  personality: z.number().int().min(0).max(10),
  practicality: z.number().int().min(0).max(10),
  costEffectiveness: z.number().int().min(0).max(10),
});

const UpdateCurationSchema = z.object({
  nickname: z.string().min(1, '닉네임은 1자 이상이어야 합니다.').optional(),
  content: z.string().min(1, '내용은 1자 이상이어야 합니다.').optional(),
  password: z.string().min(1, '비밀번호는 필수입니다.'), // 비밀번호는 수정 시 항상 필수
  trendy: z.number().int().min(0).max(10).optional(),
  personality: z.number().int().min(0).max(10).optional(),
  practicality: z.number().int().min(0).max(10).optional(),
  costEffectiveness: z.number().int().min(0).max(10).optional(),
});

const DeleteCurationSchema = z.object({
  password: z.string().min(1, '비밀번호는 필수입니다.'),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      // 이후 에러핸들러로 전달
      message: '입력 값 유효성 검사에 실패했습니다.',
      errors: error.errors,
    });
  }
};

const validatePostCuration = validate(PostCurationSchema);
const validateUpdateCuration = validate(UpdateCurationSchema);
const validateDeleteCuration = validate(DeleteCurationSchema);

export { validatePostCuration, validateUpdateCuration, validateDeleteCuration };
