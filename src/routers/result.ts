import { CustomRequest, CustomResponse } from '@lib/interface';
import mustBeAuthenticated from '@middlewares/authenticated';
import express from 'express';

const router = express.Router();

const getTaskResult = async (req: CustomRequest, res: CustomResponse) => {
  const { params, models } = req;
  const { taskId } = params;
  const result = await models?.resultManager.getTaskResult(taskId);
  if (!result) {
    res.utils?.error('找不到对应的文件');
    return;
  }
  const audioInfo = await models?.taskManager.findTaskByTaskId(taskId);
  res.utils?.data({
    ...result,
    audioId: audioInfo?.audioId
  });
}

router.get('/api/result/:taskId', mustBeAuthenticated, getTaskResult)

export default router;