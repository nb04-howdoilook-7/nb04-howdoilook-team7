import express from 'express';
import { validatePostComment, validatePutComment, validateDeleteComment } from '../Validators/CommentValidator.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import CommentController from '../Controllers/CommentController.js';
import protect from '../Middlewares/auth.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

curationNestedCommentRouter
  .route('/')
  .post(protect(), validatePostComment, asyncHandler(CommentController.postComment));

commentRouter
  .route('/:id')
  .put(protect(), validatePutComment, asyncHandler(CommentController.putComment))
  .delete(protect(), validateDeleteComment, asyncHandler(CommentController.deleteComment));

export { curationNestedCommentRouter, commentRouter };
