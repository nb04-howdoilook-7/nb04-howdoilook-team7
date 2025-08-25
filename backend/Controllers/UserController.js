import {
  requestVerificationService,
  confirmSignupService,
  putUserService,
  deleteUserService,
  loginUserService,
  getUserInfoService,
} from '../Services/UserService.js';

class UserController {
  async requestVerification(req, res) {
    const result = await requestVerificationService(req.body);
    res.status(200).json(result);
  }

  async confirmSignup(req, res) {
    const { user } = await confirmSignupService(req.body);
    res.status(201).json({ user });
  }

  async login(req, res) {
    const { user, token } = await loginUserService(req.body);
    // console.log({ user, token });
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
