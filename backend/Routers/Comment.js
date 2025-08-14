import express from 'express';
// prettier-ignore
import { postComment, putComment, deleteComment } from '../Services/CommentService.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

// prettier-ignore
curationNestedCommentRouter.route('/')
  .post(postComment());

// prettier-ignore
commentRouter.route('/:id')
  .put(putComment())
  .delete(deleteComment());

export { curationNestedCommentRouter, commentRouter };
