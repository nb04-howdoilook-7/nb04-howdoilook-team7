import type { RequestHandler } from 'express';
import { getCurationListService, postCurationService, putCurationService, deleteCurationService } from '../Services/CurationService.js'; // prettier-ignore
import { hasId, hasParentId, hasParsedCurationQuery, hasTokenPayload } from '../types/guard.js';
import { BadRequestError, UnauthorizedError } from '../Libs/errors.js';

class CurationController {
  getCurationList: RequestHandler = async (req, res) => {
    if (!hasParentId(req) || !hasParsedCurationQuery(req)) {
      throw new BadRequestError();
    }
    const styleId = req.parentId;
    const result = await getCurationListService({styleId, ...req.parsedCurationQuery}) // prettier-ignore
    res.status(200).json(result);
  };
  postCuration: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasParentId(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const styleId = req.parentId;
    const result = await postCurationService({userId, styleId, ...req.body}); // prettier-ignore
    res.status(201).json(result);
  };
  putCuration: RequestHandler = async (req, res) => {
    if (!hasParentId(req) || !hasId(req)) {
      throw new BadRequestError();
    }
    const { id: curationId } = req.parsedId;
    const result = await putCurationService({curationId, ...req.body}); // prettier-ignore
    res.status(200).json(result);
  };
  deleteCuration: RequestHandler = async (req, res) => {
    if (!hasTokenPayload(req)) {
      throw new UnauthorizedError();
    }
    if (!hasParentId(req) || !hasId(req)) {
      throw new BadRequestError();
    }
    const { userId } = req.tokenPayload;
    const { id: curationId } = req.parsedId;
    const result = await deleteCurationService({curationId, userId}); // prettier-ignore
    res.status(200).json(result);
  };
}

export default new CurationController();
