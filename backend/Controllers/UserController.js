import {
  putUserService,
  deleteUserService,
  signupService,
  loginUserService,
  getUserInfoService,
} from '../Services/UserService.js';

class UserController {
  async signup(req, res) {
    const newUser = await signupService(req.body);
    res.status(201).json(newUser);
  }
  async login(req, res) {
    const { user, token } = await loginUserService(req.body);
    res.status(200).json({ user, accessToken: token });
  }
  async getUserInfo(req, res) {
    const data = await getUserInfoService(req.userId);
    res.status(201).json(data);
  }
  async putUserInfo(req, res) {
    const data = await putUserService(req.userId, req.body);
    res.status(200).json(data);
  }
  async deleteUser(req, res) {
    const data = await deleteUserService(req.userId, req.body);
    res.status(200).json(data);
  }
}

export default new UserController();
