import mustBeAuthenticated from '../middlewares/authenticated';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';
import { promisify } from 'es6-promisify';
import FTPClient from '@lib/ftp/client';
import { AudioAnalyseInfo, AudioInfo } from './interface';
import { nanoid } from 'nanoid';

const router = express.Router();
const uploader = multer({ dest: 'upload' }).array('files');


const uploadAudio = async(req: CustomRequest, res: CustomResponse) => {
  const { files, appLog, config, models, user } = req;
  if (!files) {
    res.utils!.error('文件上传失败');
  }
  let audioInfoList: Array<AudioInfo> = [];
  const destDir = config?.get('ftpUploadDest') ?? 'ivoice';
  
  try {
    audioInfoList = await Promise.all((files as Express.Multer.File[])!.map(async (file) => {
      const newFilePath = renameFile(file);
      const { originalname } = file;
      const audioAnalyseInfo = await analyseAudio(newFilePath);
      return {
        ...audioAnalyseInfo,
        id: nanoid(),
        name: originalname,
        localStorePath: newFilePath,
        ftpStorePath: path.join(destDir, originalname),
      }
    }));
  }catch (e) {
    res.utils!.error(e);
  }

  res.utils!.data(audioInfoList);

  const ftpClient = new FTPClient(config!);
  const unlink = promisify(fs.unlink);

  const onFTPClientReady = () => {
    audioInfoList.map(async (file) => {
      const { localStorePath, name } = file;
      try {
        await ftpClient.put(localStorePath, name);
        await unlink(localStorePath);
        appLog?.info(`File ${name} was deleted successfully`);
      }catch(e) {
        appLog?.error(e);
      }
    })
    ftpClient.end();
  }

  ftpClient.onClientConnectReady(onFTPClientReady);
  ftpClient.connect();

  // models update
  models?.audioManager.createAudio((user as any).id, audioInfoList);

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
