import type { RequestHandler } from 'express';
import {
  getStyleService,
  getStyleListService,
  postStyleService,
  putStyleService,
  deleteStyleService,
  getRankingListService,
  toggleStyleLikeService,
} from '../Services/StyleService.js';
import { getUserStyleService } from '../Services/UserService.js';
import {
  hasId,
  hasParsedQuery,
  hasParsedRankQuery,
  hasParsedUserQuery,
  hasTokenPayload,
} from '../types/guard.js';
import { BadRequestError, UnauthorizedError } from '../Libs/errors.js';

class StyleController {
  getStyle: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { id: styleId } = req.parsedId;
    const { userId } = req.tokenPayload || {};
    const result = await getStyleService({ styleId, userId });
    res.status(200).json(result);
  };
  getStyleList: RequestHandler = async (req, res) => {
    if (!hasParsedQuery(req)) {
      throw new BadRequestError();
    }
    const result = await getStyleListService({ ...req.parsedQuery });
    res.status(200).json(result);
  };
  postStyle: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    const { userId } = req.tokenPayload;
    const data = req.body;
    const result = await postStyleService({ userId, data });
    res.status(201).json(result);
  };
  putStyle: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { id: styleId } = req.parsedId;
    const data = req.body;
    const result = await putStyleService({ styleId, data });
    res.status(200).json(result);
  };
  deleteStyle: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    const { id: styleId } = req.parsedId;
    const result = await deleteStyleService({ styleId });
    res.status(200).json(result);
  };
  getRankingList: RequestHandler = async (req, res) => {
    if (!hasParsedRankQuery(req)) {
      throw new BadRequestError();
    }
    const result = await getRankingListService({ ...req.parsedRankQuery });
    res.status(200).json(result);
  };
  getUserStyle: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasParsedUserQuery(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const result = await getUserStyleService({ userId, ...req.parsedUserQuery });
    res.status(200).json(result);
  };
  toggleStyleLike: RequestHandler = async (req, res) => {
    if (!hasId(req)) {
      throw new BadRequestError();
    }
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    const { id: styleId } = req.parsedId;
    const { userId } = req.tokenPayload;
    const result = await toggleStyleLikeService({ userId, styleId });
    res.status(200).json(result);
  };
}

export default new StyleController();
