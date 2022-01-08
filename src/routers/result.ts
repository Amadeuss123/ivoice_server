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
  res.utils?.data(result);
}

router.get('/api/result/:taskId', mustBeAuthenticated, getTaskResult)

export default router;