import { requestVerificationService, confirmSignupService, loginUserService } from '../Services/AuthService.js';

class AuthController {
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
    res.status(200).json({ user, accessToken: token });
  }
}

export default new AuthController();
