import express from 'express';
import { getRankingList } from '../Services/StyleService.js';

const rankingRouter = express.Router();

// prettier-ignore
rankingRouter.route('/')
    .get(getRankingList())

export default rankingRouter;
