import express from 'express';
import hashingPassword from '../Middlewares/hashing.js';
import userValidator from '../Validators/UserValidator.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import UserController from '../Controllers/UserController.js';

const userRouter = express.Router();

// prettier-ignore
userRouter
  .route('/signup')
  .post(
    userValidator(),
    hashingPassword(),
    asyncHandler(UserController.postUser),
  );

export default userRouter;
