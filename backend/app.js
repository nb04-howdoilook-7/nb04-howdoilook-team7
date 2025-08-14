import express from 'express';
import styleRouter from './Routers/Style.js';
import { CurationRouter } from './Routers/Curation.js';
import { commentRouter } from './Routers/Commetnts.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/styles', styleRouter);
app.use('/curations', CurationRouter);
app.use('/comments', commentRouter);

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
