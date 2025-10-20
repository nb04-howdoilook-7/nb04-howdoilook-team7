import type { RequestHandler } from 'express';
import {
  requestVerificationService,
  confirmSignupService,
  loginUserService,
} from '../Services/AuthService.js';

class AuthController {
  requestVerification: RequestHandler = async (req, res) => {
    const result = await requestVerificationService({ ...req.body });
    res.status(200).json(result);
  };
  confirmSignup: RequestHandler = async (req, res) => {
    const { user } = await confirmSignupService({ ...req.body });
    res.status(201).json({ user });
  };
  login: RequestHandler = async (req, res) => {
    const { user, token } = await loginUserService({ ...req.body });
    res.status(200).json({ user, accessToken: token });
  };
}

export default new AuthController();
