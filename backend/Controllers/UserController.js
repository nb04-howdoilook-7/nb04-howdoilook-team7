import {
  putUserService,
  deleteUserService,
  signupService,
  loginUserService,
} from '../Services/UserService.js';

class UserController {
  async signup(req, res) {
    const newUser = await signupService(req.body);
    console.log(newUser);
    res.status(201).json(newUser);
  }
  async login(req, res) {
    const { user, token } = await loginUserService(req.body);
    console.log({ user, token });
    res.status(200).json({ user, accessToken: token });
  }
  async getUserInfo(req, res) {
    const data = await getUserInfoService(req.headers);
    res.status(201).json(data);
  }
  async putUserInfo(req, res) {
    const data = await putUserService(req.headers, req.body);
    res.status(200).json(data);
  }
  async deleteUser(req, res) {
    const data = await deleteUserService(req.headers, req.body);
    res.status(200).json(data);
  }
}

export default new UserController();
