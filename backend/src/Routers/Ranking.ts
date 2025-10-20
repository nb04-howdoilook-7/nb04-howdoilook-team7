import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import StyleController from '../Controllers/StyleController.js';
import { validateRankQuery } from '../Middlewares/validators/styles.validators.js';

const rankingRouter = express.Router();

// prettier-ignore
rankingRouter.route('/')
    .get(validateRankQuery, asyncHandler(StyleController.getRankingList))

export default rankingRouter;
