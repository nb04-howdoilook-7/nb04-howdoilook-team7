import {
  postUserService,
  loginUserService,
  getUserByIdService,
} from '../Services/UserService.js';

const UserController = {
  async postUser(req, res) {
    const { email, password, nickname } = req.body;
    const newUser = await postUserService(email, password, nickname);
    res.status(201).json(newUser);
  },

  async loginUser(req, res) {
    const { email, password } = req.body;
    const { user, token } = await loginUserService(email, password);
    res.status(200).json({ user, accessToken: token });
  },

  async getMe(req, res) {
    const user = await getUserByIdService(req.userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('사용자를 찾을 수 없습니다.');
    }
  },
};
export default UserController;
