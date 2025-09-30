import express from 'express';
import { styleRouter } from './Style.js';
import { CurationRouter } from './Curation.js';
import { commentRouter } from './Comment.js';
import rankingRouter from './Ranking.js';
import userRouter from './User.js';
import authRouter from './Auth.js';
import ImageRouter from './Image.js';

const router = express.Router();

router.use('/styles', styleRouter);
router.use('/curations', CurationRouter);
router.use('/comments', commentRouter);
router.use('/ranking', rankingRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/images', ImageRouter);

export default router;
