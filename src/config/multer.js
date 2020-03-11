import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: path.resolve('uploads', 'temp'),
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export default {
  storage,
};
