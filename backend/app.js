import dotenv from 'dotenv';
import express from 'express';
import styleRouter from './Routers/Style.js';
import { CurationRouter } from './Routers/Curation.js';
import { commentRouter } from './Routers/Comment.js';
import rankingRouter from './Routers/Ranking.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/styles', styleRouter);
app.use('/curations', CurationRouter);
app.use('/comments', commentRouter);
app.use('/ranking', rankingRouter);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
