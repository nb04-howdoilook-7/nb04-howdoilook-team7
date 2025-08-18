import dotenv from 'dotenv';
import express from 'express';
import styleRouter from './Routers/Style.js';
import { CurationRouter } from './Routers/Curation.js';
import { commentRouter } from './Routers/Comment.js';
import rankingRouter from './Routers/Ranking.js';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = 3001;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // 프론트쪽의 요청 전부 로깅
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/tags', (req, res) => {
  res.json({ tags: ['test1', 'test2'] });
});
app.use('/styles', styleRouter);
app.use('/curations', CurationRouter);
app.use('/comments', commentRouter);
app.use('/ranking', rankingRouter);

app.post('/images', upload.single('image'), (req, res) => {
  const mim = req.file.mimetype;
  let type = '';
  if (mim.includes('jpg')) {
    type = '.jpg';
  } else if (mim.includes('png')) {
    type = '.png';
  }
  const path = `uploads/${req.file.filename}${type}`;
  fs.renameSync(req.file.path, path);
  res.status(201).json({ imageUrl: 'http://localhost:3001/' + path });
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 실행중입니다.`);
});
