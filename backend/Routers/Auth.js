import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import hashingPassword from '../Middlewares/hashing.js';
import userValidator from '../Validators/UserValidator.js';
import AuthController from '../Controllers/AuthController.js';

const authRouter = new express.Router();
// prettier-ignore
authRouter
  .route('/request-verification')
  .post(userValidator(), hashingPassword(), asyncHandler(AuthController.requestVerification));
// prettier-ignore
authRouter.route('/confirm-signup').post(asyncHandler(AuthController.confirmSignup));
// prettier-ignore
authRouter.route('/login').post(userValidator(), asyncHandler(AuthController.login));

export default authRouter;
