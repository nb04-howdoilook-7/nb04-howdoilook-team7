import * as z from 'zod';

const postUserSchema = z
  .object({
    email: z.string().email('유효하지 않은 이메일 주소입니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        '비밀번호는 숫자와 문자를 모두 포함해야 합니다.',
      ),
    nickname: z.string().min(3, '닉네임은 최소 3자 이상이어야 합니다.'),
  })
  .strict();

function userValidator() {
  return (req, res, next) => {
    try {
      switch (req.method) {
        case 'POST':
          postUserSchema.parse(req.body);
          break;
        default:
          return res.status(400).json({ error: '잘못된 요청 메서드' });
      }
      next();
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: '유효성 검증 실패', message: e });
    }
  };
}

export default userValidator;
