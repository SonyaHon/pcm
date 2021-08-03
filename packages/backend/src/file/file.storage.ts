import * as multer from 'multer';
import { Config } from '../config';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Config().fileStorage.destination);
  },
  filename: (req, file, cb) => {
    const id = uuid();
    const ext = extname(file.originalname);
    cb(null, `${id}${ext}`);
  },
});
