import express from 'express';
import { rankingValidator } from '../Validators/StyleValidator.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import StyleController from '../Controller/StyleController.js';

const rankingRouter = express.Router();

// prettier-ignore
rankingRouter.route('/')
    .get(rankingValidator(), asyncHandler(StyleController.getRankingList))

export default rankingRouter;
