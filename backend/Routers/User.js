import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import hashingPassword from '../Middlewares/hashing.js';
import userValidator from '../Validators/UserValidator.js';
import UserController from '../Controllers/UserController.js';
import { protect } from '../Middlewares/auth.js';
import { userNestedStyleRouter } from './Style.js';

const userRouter = express.Router();

userRouter.use('/me/styles', userNestedStyleRouter);
userRouter.route('/me/likes').get(protect(), asyncHandler(UserController.getUserLikeStyle));

// prettier-ignore
// userRouter.route('/signup')
//     .post(userValidator(), hashingPassword(), asyncHandler(UserController.signup));

// prettier-ignore
userRouter
  .route('/request-verification')
  .post(userValidator(), hashingPassword(), asyncHandler(UserController.requestVerification));
// prettier-ignore
userRouter.route('/confirm-signup')
  .post(asyncHandler(UserController.confirmSignup));
// prettier-ignore
userRouter.route('/login')
    .post(userValidator(), asyncHandler(UserController.login));
// prettier-ignore
userRouter.route('/me')
    .get(protect(), asyncHandler(UserController.getUserInfo))
    .put(protect(), hashingPassword(), asyncHandler(UserController.putUserInfo))
    .delete(protect(), asyncHandler(UserController.deleteUser))

export default userRouter;
