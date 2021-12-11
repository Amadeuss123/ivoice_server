import mustBeAuthenticated from '../middlewares/authenticated';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';

const router = express.Router();
const uploader = multer({ dest: 'upload' }).single('files');


const uploadAudio = async(req: CustomRequest, res: CustomResponse) => {
  const { file } = req;
  const newFilePath = renameFile(file!);
  const audioData = await analyseAudio(newFilePath);

  res.utils!.data({ audioData });
};

const renameFile = (file: Express.Multer.File) => {
  const { filename, originalname } = file;
  const dest = path.join(__dirname, '../../upload');
  const oldFilePath = path.join(dest, filename);
  const newFilePath = path.join(dest, originalname);
  fs.renameSync(oldFilePath, newFilePath);
  return newFilePath;
};

const analyseAudio = (filePath: string) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(filePath, (error, data) => {
      if (error) {
        resolve({
          success: false,
        });
        return;
      }
      const {
        streams: [stream],
        format,
      } = data;
      resolve({
        sampleRate: stream.sample_rate,
        channels: stream.channels,
        bitRate: format.bit_rate,
        duration: format.duration,
        author: format.tags?.artist,
        size: format.size,
        format: format.format_name,
      });
    });
  });
};

const getAudioDetailByAudioId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success get audio detail' });
};

const deleteAudioByAudioId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success delete audio' });
};

router.post('/api/audio/upload', mustBeAuthenticated, uploader, uploadAudio);
router.get(
  '/api/audio/detail/:audioId',
  mustBeAuthenticated,
  getAudioDetailByAudioId
);
router.delete('/api/audio/:audioId', mustBeAuthenticated, deleteAudioByAudioId);

export default router;
