import dotenv from 'dotenv';
import express from 'express';
import styleRouter from './Routers/Style.js';
import { CurationRouter } from './Routers/Curation.js';
import { commentRouter } from './Routers/Comment.js';
import rankingRouter from './Routers/Ranking.js';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // 프론트쪽의 요청 전부 로깅
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/styles', styleRouter);
app.use('/curations', CurationRouter);
app.use('/comments', commentRouter);
app.use('/ranking', rankingRouter);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
