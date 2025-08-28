import bcrypt from 'bcrypt';

export default function hashingPassword() {
  return async (req, res, next) => {
    const { password, currentPassword } = req.body;
    if (password && password !== '') {
      // 로그인 하는 경우와 비밀번호 수정하는 경우
      if (password === currentPassword) {
        const err = new Error(
          '바꾸려는 비밀번호는 현재 비밀번호와 달라야 합니다!',
        );
        err.statusCode = 400;
        throw err;
      } else {
        const hasedPassword = await bcrypt.hash(password, 10); // salted 횟수 지정 (해싱 취약점 해소방안)
        req.body.password = hasedPassword;
      }
    }
    next();
  };
}
