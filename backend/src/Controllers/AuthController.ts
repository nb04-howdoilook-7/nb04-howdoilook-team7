import type { RequestHandler } from 'express';
import {
  requestVerificationService,
  confirmSignupService,
  loginUserService,
  googleLoginService,
  googleLoginCallbackService,
} from '@/Services/AuthService.js';
import { NODE_ENV } from '../Libs/constants.js';

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
  googleLogin: RequestHandler = async (req, res) => {
    const frontRedirectUrl = req.query['redirectUrl'] as string;
    const { authorizeUrl } = await googleLoginService(frontRedirectUrl);
    res.redirect(authorizeUrl);
  };
  googleLoginCallback: RequestHandler = async (req, res) => {
    const code = req.query['code'] as string;
    const state = req.query['state'] as string;
    const { accessToken, refreshToken, finalRedirectUrl } = await googleLoginCallbackService(
      code,
      state
    );
    // 토큰 처리 및 최종 리디렉션
    // (1) 리프레시 토큰은 HttpOnly 쿠키에 담아 안전하게 전달
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // https에서만
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    // (2) 액세스 토큰은 URL 쿼리 파라미터에 실어서 최종 목적지로 리디렉션
    res.redirect(`${finalRedirectUrl}?accessToken=${accessToken}`);
  };
}

export default new AuthController();
