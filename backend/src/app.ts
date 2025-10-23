import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cron from 'node-cron';
import { calculatePopularTags } from './Jobs/calculatePopularTags.js';
import { prismaErrorHandler } from './Middlewares/errorHandlers/prismaErrorHandler.js';
import { zodErrorHandler } from './Middlewares/errorHandlers/zodErrorHandler.js';
import { businessErrorHandler } from './Middlewares/errorHandlers/businessErrorHandler.js';
import { catchAllErrorHandler } from './Middlewares/errorHandlers/catchAllErrorHandler.js';
import router from './Routers/index.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Request } from 'express';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

app.use(cors());
app.use(
  express.json({
    verify: (req: IncomingMessage, res: ServerResponse, buf: Buffer, _encoding: string) => {
      (req as unknown as Request).rawBody = buf; // Express Request로 캐스팅
    },
  })
);
app.use(morgan('dev')); // 프론트쪽의 요청 전부 로깅
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(prismaErrorHandler);
app.use(zodErrorHandler);
app.use(businessErrorHandler);
app.use(catchAllErrorHandler);

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
