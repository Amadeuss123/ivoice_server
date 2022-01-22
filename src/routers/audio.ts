import mustBeAuthenticated from '../middlewares/authenticated';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';
import { promisify } from 'es6-promisify';
import FTPClient from '@lib/ftp/client';
import { AudioAnalyseInfo, AudioInfo, UploadParseResult } from './interface';
import { nanoid } from 'nanoid';
import formidable, { Options } from 'formidable';
import { getProjectRootDir, isFileExists } from '@utils/file';
import { UploadDirName } from '@const/audio';
import appLog from '@lib/log/app-log';
import AppLogger from '@lib/log/logger';

const router = express.Router();
// const uploader = multer({ dest: UploadDirName }).array('files');


const uploadAudio = async(req: CustomRequest, res: CustomResponse) => {
  const { appLog, config, models, user } = req;
  let audioInfoList: Array<AudioInfo> = [];
  const destDir = config?.get('storeDirPath') ?? 'upload';
  try {
    const {files} = await parseFormData(req, appLog!);
    audioInfoList = await Promise.all((files as any[])!.map(async (file) => {
      const audioId = nanoid();
      const [newFilePath, newName] = renameFile(file, UploadDirName, audioId);
      const audioAnalyseInfo = await analyseAudio(newFilePath);
      return {
        ...audioAnalyseInfo,
        id: audioId,
        // name: originalname,
        name: newName,
        localStorePath: newFilePath,
        // ftpStorePath: path.join(destDir, originalname),
        storePath: path.join(destDir, newName),
      }
    }));

  } catch(e) {
    appLog?.error(e);
    res.utils?.error('文件上传失败');
    return;
  }

  res.utils!.data(audioInfoList);

  const ftpClient = FTPClient.getInstance(config!);
  const unlink = promisify(fs.unlink);

  const onFTPClientReady = () => {
    audioInfoList.map(async (file) => {
      const { localStorePath, name } = file;
      try {
        await ftpClient.put(localStorePath, name);
        // await unlink(localStorePath);
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

const parseFormData = (req: CustomRequest, appLog: AppLogger) => {
  return new Promise<UploadParseResult>((resolve, reject) => {
    const form = formidable({
      uploadDir: UploadDirName,
      keepExtensions: true,
      multiples: true,
    });
    form.parse(req, (error, fields, files) => {
      if (error) {
        appLog.error(error);
        reject(error);
      }
      resolve({
        files: Array.isArray(files.files) ? files.files : [files.files],
      })
    })
  })
}

const renameFile = (file: any, dirName: string, fileId: string) => {
  const { path: oldPath, name } = file;
  const [fileName, ext] = name.split('.');
  const projectRootDir = getProjectRootDir();
  const dest = path.join(projectRootDir, dirName);
  const oldFilePath = path.join(projectRootDir, oldPath);
  const newName = `${fileName}-${fileId.slice(0,5)}.${ext}`;
  const newFilePath = path.join(dest, newName);
  fs.renameSync(oldFilePath, newFilePath);
  return [newFilePath, newName];
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
        format: format.format_long_name || '',
      });
    });
  });
};

const getAudioDetailByAudioId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success get audio detail' });
};

const getAudioListByUserId = async (req: CustomRequest, res: CustomResponse) => {
  const { user, models } = req;
  if (!user) {
    res.utils?.error('该用户未登录');
    return;
  }
  const { id } = user as any;
  const audioList = await models?.audioManager.findAudioListByUserId(id);
  res.utils?.data(audioList);
}

const deleteAudioByAudioId = async (req: CustomRequest, res: CustomResponse) => {
  const { models, params } = req;
  const { audioId } = params;
  const result = await models?.audioManager.deleteAudioByAudioId(audioId);
  if (!result) {
    res.utils?.error('删除失败');
    return;
  }
  res.utils!.data({ message: '删除成功' });
};

const getAudioBlobByAudioId = async (req: CustomRequest, res: CustomResponse) => {
  const { models, params, appLog, config } = req;
  const { audioId } = params;

  const audioInfo = await models?.audioManager.findAudioById(audioId);
  if (!audioInfo) {
    res.utils?.error('找不到该音频文件');
    return
  }
  const { path: audioPath, name } = audioInfo

  const projectRootDir = getProjectRootDir();
  // 先检查本地是否有
  if (isFileExists(audioPath)) {
    // 有则直接传回
    res.sendFile(path.resolve(projectRootDir, audioPath), (error) => {
      appLog?.error(error);
    });
    return;
  }

  // TODO 否则从ftp服务器上下载下来传回
  const ftpClient = FTPClient.getInstance(config!);
  const onFTPClientReady = async () => {
    try {
      await ftpClient.get(name, path.resolve(projectRootDir, audioPath));
      res.utils?.data('yes');
    }catch(e) {
      res.utils?.error(e);
      return;
    }
  }
  ftpClient.onClientConnectReady(onFTPClientReady);
  ftpClient.connect();

}

router.post('/api/audio/upload', mustBeAuthenticated, uploadAudio);
router.get(
  '/api/audio/detail/:audioId',
  mustBeAuthenticated,
  getAudioDetailByAudioId
);
router.delete('/api/audio/:audioId', mustBeAuthenticated, deleteAudioByAudioId);
router.get('/api/audio/blob/:audioId', mustBeAuthenticated, getAudioBlobByAudioId);
router.get('/api/audio/list', mustBeAuthenticated, getAudioListByUserId);

export default router;
