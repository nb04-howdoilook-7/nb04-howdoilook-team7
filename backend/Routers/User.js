import express from 'express';
import hashingPassword from '../Middlewares/hashing.js';
import userValidator from '../Validators/UserValidator.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import UserController from '../Controllers/UserController.js';
import protect from '../Middlewares/auth.js';

const userRouter = express.Router();

userRouter
  .route('/signup')
  .post(
    userValidator(),
    hashingPassword(),
    asyncHandler(UserController.postUser),
  );

userRouter
  .route('/login')
  .post(userValidator(), asyncHandler(UserController.loginUser));

userRouter.route('/me').get(protect, asyncHandler(UserController.getMe));

export default userRouter;
