import mustBeAuthenticated from '../middlewares/authenticated';
import multer from 'multer';
import fs, { rename } from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';
import { nanoid } from 'nanoid';

type AudioAnalyseInfo = {
  sampleRate: number,
  channels: number,
  bitRate: number,
  duration: number,
  size: number,
  format: string,
}

type AudioInfo = AudioAnalyseInfo & {
  name: string,
}

const router = express.Router();
const uploader = multer({ dest: 'upload' }).array('files');
const audioInfoMap = new Map<string, any>();


const uploadAudio = async(req: CustomRequest, res: CustomResponse) => {
  const { files } = req;
  if (!files) {
    res.utils!.error('文件上传失败');
  }
  const audioInfoList: Array<AudioInfo> = [];
  try {
    Promise.all((files as Express.Multer.File[])!.map(async (file) => {
      const newFilePath = renameFile(file);
      const audioAnalyseInfo = await analyseAudio(newFilePath);
      audioInfoList.push({
        ...audioAnalyseInfo,
        name: file.originalname,
      });
    })).then(() => res.utils?.data(audioInfoList)).catch((e) => res.utils?.data(e));
  }catch (e) {
    res.utils!.data(e);
  }


  // TODO 
  // await req.models.audio.saveAudioInfo();
  // const audioId = nanoid();
  // const newFilePath = renameFile(file!, 'temp', audioId);
  // try {
  //   const audioData = await analyseAudio(newFilePath);
  //   audioInfoMap.set(audioId, audioData);
  //   res.utils!.data({
  //     id: audioId,
  //     ...audioData
  //   });
  // }catch(e) {
  //   res.utils!.data(e);
  // }

};

const renameFile = (file: Express.Multer.File, dirName = 'upload', fileId = '') => {
  const { filename, originalname } = file;
  const [name, ext] = originalname.split('.');
  const dest = path.join(__dirname, `../../${dirName}`);
  const oldFilePath = path.join(dest, filename);
  const newFilePath = path.join(dest, `${name}-${fileId}.${ext}`);
  fs.renameSync(oldFilePath, newFilePath);
  return newFilePath;
};

const analyseAudio = (filePath: string) => {
  return new Promise<AudioAnalyseInfo>((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (error, data) => {
      if (error) {
        reject('can not resolve file');
      }
      const {
        streams: [stream],
        format,
      } = data;
      resolve({
        sampleRate: stream.sample_rate || 0,
        channels: stream.channels || 0,
        bitRate: format.bit_rate || 0,
        duration: format.duration || 0,
        size: format.size || 0,
        format: format.format_name || '',
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

const submitAudioFile = (req: CustomRequest, res: CustomResponse) => {
  // const audioIds = 
}

router.post('/api/audio/upload', mustBeAuthenticated, uploader, uploadAudio);
router.get(
  '/api/audio/detail/:audioId',
  mustBeAuthenticated,
  getAudioDetailByAudioId
);
router.delete('/api/audio/:audioId', mustBeAuthenticated, deleteAudioByAudioId);

export default router;
