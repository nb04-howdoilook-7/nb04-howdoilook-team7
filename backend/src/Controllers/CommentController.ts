import type { RequestHandler } from 'express';
import {
  postCommentService,
  putCommentService,
  deleteCommentService,
} from '../Services/CommentService.js';
import { hasId, hasParentId, hasTokenPayload } from '../types/guard.js';
import { BadRequestError, UnauthorizedError } from '../Libs/errors.js';

class CommentController {
  postComment: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasParentId(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const curationId = req.parentId;
    const { content } = req.body;
    const result = await postCommentService({ userId, curationId, content });
    res.status(201).json(result);
  };
  putComment: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const { id: commentId } = req.parsedId;
    const { content } = req.body;
    const result = await putCommentService({ userId, commentId, content });
    res.status(200).json(result);
  };
  deleteComment: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const { id: commentId } = req.parsedId;
    const result = await deleteCommentService({ userId, commentId });
    res.status(200).json(result);
  };
}

export default new CommentController();
