import {
  postUserService,
  putUserService,
  deleteUserService,
  signupService,
  loginService,
} from '../Services/UserService.js';

class UserController {
  async signup(req, res) {
    const data = await signupService(req.body);
    res.status(201).json(data);
  }
  async login(req, res) {
    const data = await loginService(req.body);
    res.status(200).json(data);
  }
  async getUserInfo(req, res) {
    const data = await postUserService(req.headers);
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
