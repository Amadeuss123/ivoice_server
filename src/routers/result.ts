import { CustomRequest, CustomResponse } from '@lib/interface';
import RabbitMQ from '@lib/rabbitmq/rabbitmq';
import mustBeAuthenticated from '@middlewares/authenticated';
import express from 'express';

const router = express.Router();

const getTaskResult = async (req: CustomRequest, res: CustomResponse) => {
  const { params, models } = req;
  const { taskId } = params;
  const result = await models?.resultManager.getTaskResultByTaskId(taskId);
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

const updateTaskResult = async (req: CustomRequest, res: CustomResponse) => {
  const { params, body, models } = req;
  const { taskId } = params;
  const { content } = body;
  const result = await models?.resultManager.updateTaskResultByTaskId(taskId, { content });
  if (!result) {
    res.utils?.error('更新失败');
    return;
  }
  res.utils?.data('更新成功');
}

const generateResultAbstract = async (req: CustomRequest, res: CustomResponse) => {
  const { body, appLog, config, params } = req;
  const { taskId } = params;
  const { content } = body;
  const rabbitMQ = RabbitMQ.getInstance(config!, appLog!);
  // rabbitMQ.sendQueueMessage(
  //   'abstract',
  //   JSON.stringify({
  //     content,
  //     taskId,
  //   }),
  //   (e: any) => appLog?.error(e),
  // )
  res.utils?.data('success');
}

const getResultAbstract = async (req: CustomRequest, res: CustomResponse) => {
  const { models, params } = req;
  const { taskId } = params;
  const result = await models?.resultManager.getTaskResultByTaskId(taskId);
  if (result?.abstract) {
    res.utils?.data({
      abstract: result.abstract,
    });
    return;
  }
  res.utils?.data({
    status: 'not finished',
  });
}

router.get('/api/result/:taskId', mustBeAuthenticated, getTaskResult);
router.post('/api/result/update/:taskId', mustBeAuthenticated, updateTaskResult);
router.post('/api/result/abstract/:taskId', mustBeAuthenticated, generateResultAbstract);
router.get('/api/result/abstract/:taskId', mustBeAuthenticated, getResultAbstract);

export default router;