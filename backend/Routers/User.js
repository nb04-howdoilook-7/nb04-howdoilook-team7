import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import { userNestedStyleRouter } from './Style.js';

const userRouter = express.Router();

userRouter.use('/me/styles', userNestedStyleRouter);

// prettier-ignore
userRouter.route('/signup')
    .post(asyncHandler(UserController.signup));
// prettier-ignore
userRouter.route('/login')
    .post(asyncHandler(UserController.login));
// prettier-ignore
userRouter.route('/me')
    .get(asyncHandler(UserController.getUserInfo))
    .put(asyncHandler(UserController.putUserInfo))
    .delete(asyncHandler(UserController.deleteUser))

export default userRouter;
