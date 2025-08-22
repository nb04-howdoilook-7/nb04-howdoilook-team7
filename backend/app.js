import dotenv from 'dotenv';
dotenv.config(); // .env파일을 제일 먼저 읽어오는게 좋다고해서 옮김

import express from 'express';
import styleRouter from './Routers/Style.js';
import { CurationRouter } from './Routers/Curation.js';
import { commentRouter } from './Routers/Comment.js';
import rankingRouter from './Routers/Ranking.js';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './Middlewares/errorHandler.js';
import cron from 'node-cron'; // 새로운 임포트
import { calculatePopularTags } from './Jobs/calculatePopularTags.js'; // 새로운 임포트

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // 프론트쪽의 요청 전부 로깅
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/styles', styleRouter);
app.use('/curations', CurationRouter);
app.use('/comments', commentRouter);
app.use('/ranking', rankingRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);

  // 인기 태그 계산 작업 예약
  // 이 예시는 매시간 (매시간 0분) 작업을 실행하도록 예약합니다.
  // 필요에 따라 크론 스케줄을 조정할 수 있습니다.
  // 예를 들어, '0 0 * * *'는 자정 하루에 한 번 실행됩니다.
  cron.schedule('0 * * * *', () => {
    console.log('인기 태그 계산 작업 실행 중...');
    calculatePopularTags();
  });

  // 서버 시작 시 즉시 작업 실행 (선택 사항)
  calculatePopularTags();
});
