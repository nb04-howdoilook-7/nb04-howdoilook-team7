// prettier-ignore
import type { RequestHandler } from 'express';
import {
  putUserService,
  deleteUserService,
  getUserInfoService,
  getUserLikeStyleService,
} from '../Services/UserService.js';
import { hasParsedUserQuery, hasTokenPayload } from '../types/guard.js';
import { BadRequestError, UnauthorizedError } from '../Libs/errors.js';

class UserController {
  getUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await getUserInfoService({ userId });
    res.status(201).json(result);
  };
  putUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await putUserService({ userId, data });
    res.status(200).json(result);
  };
  deleteUser: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const { userId } = req.tokenPayload;
    const result = await deleteUserService({ userId });
    res.status(200).json(result);
  };
  getUserLikeStyle: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    if (!hasParsedUserQuery(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const result = await getUserLikeStyleService({ userId, ...req.parsedUserQuery });
    res.status(200).json(result);
  };
}

export default new UserController();
