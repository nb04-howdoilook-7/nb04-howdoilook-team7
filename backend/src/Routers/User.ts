import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import UserController from '../Controllers/UserController.js';
import { protect } from '../Middlewares/auth.js';
import { userNestedStyleRouter } from './Style.js';
import {
  validateGetListQuery,
  validatePutBody,
} from '../Middlewares/validators/users.validators.js';

const userRouter = express.Router();

userRouter.use('/me/styles', validateGetListQuery, userNestedStyleRouter);
userRouter
  .route('/me/likes')
  .get(protect(), validateGetListQuery, asyncHandler(UserController.getUserLikeStyle));

// prettier-ignore
userRouter.route('/me')
    .get(protect(), asyncHandler(UserController.getUser))
    .put(protect(), validatePutBody, asyncHandler(UserController.putUser))
    .delete(protect(), asyncHandler(UserController.deleteUser))

export default userRouter;
