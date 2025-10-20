import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import AuthController from '../Controllers/AuthController.js';
import { validateLogin, validateSignup } from '../Middlewares/validators/auths.validators.js';

const authRouter = express.Router();
// prettier-ignore
authRouter
  .route('/request-verification')
  .post(validateSignup, asyncHandler(AuthController.requestVerification));
// prettier-ignore
authRouter.route('/confirm-signup').post(asyncHandler(AuthController.confirmSignup));
// prettier-ignore
authRouter.route('/login').post(validateLogin, asyncHandler(AuthController.login));

export default authRouter;
