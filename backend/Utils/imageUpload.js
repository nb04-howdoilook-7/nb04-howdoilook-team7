import fs from 'fs';
import multer from 'multer';

function imageUpload(mim, filename, receivedPath) {
  let type = '';
  if (mim.includes('jpg')) {
    type = '.jpg';
  } else if (mim.includes('png')) {
    type = '.png';
  }
  const path = `uploads/${filename}${type}`;
  fs.renameSync(receivedPath, path);
  return path;
}

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
    }
  },
});

export { upload, imageUpload };
