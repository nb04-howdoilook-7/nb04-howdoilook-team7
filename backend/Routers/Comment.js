import express from 'express';
// prettier-ignore
import { validatePostComment, validatePutComment, validateDeleteComment } from '../Validators/CommentValidator.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import CommentController from '../Controllers/CommentController.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

curationNestedCommentRouter
  .route('/')
  .post(validatePostComment, asyncHandler(CommentController.postComment));

commentRouter
  .route('/:id')
  .put(validatePutComment, asyncHandler(CommentController.putComment))
  .delete(validateDeleteComment, asyncHandler(CommentController.deleteComment));

export { curationNestedCommentRouter, commentRouter };
