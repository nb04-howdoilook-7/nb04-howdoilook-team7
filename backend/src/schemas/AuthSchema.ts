import * as z from 'zod';

export const signupSchema = z
  .object({
    email: z.email('유효하지 않은 이메일 주소입니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        '비밀번호는 숫자와 문자를 모두 포함해야 합니다.'
      ),
    nickname: z.string().min(3, '닉네임은 최소 3자 이상이어야 합니다.'),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.email('유효하지 않은 이메일 주소입니다.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
  })
  .strict();
