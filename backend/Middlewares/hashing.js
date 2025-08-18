import bcrypt from 'bcrypt';

export default function hashingPassword() {
  return async (req, res, next) => {
    const { password } = req.body;
    const hasedPassword = await bcrypt.hash(password, 10); // salted 횟수 지정 (해싱 취약점 해소방안)
    req.body.password = hasedPassword;
    next();
  };
}
