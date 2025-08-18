import express from 'express';
import { getRankingList } from '../Services/StyleService.js';
import { rankingValidator } from '../Validators/StyleValidator.js';

const rankingRouter = express.Router();

// prettier-ignore
rankingRouter.route('/')
    .get(rankingValidator(), getRankingList())

export default rankingRouter;
