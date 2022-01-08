import mustBeAuthenticated from '../middlewares/authenticated';
import express from 'express';
import { CustomRequest, CustomResponse } from '@lib/interface';
import GRPCClient from '@lib/grpc/client';
import appLog from '@lib/log/app-log';
import RabbitMQ from '@lib/rabbitmq/rabbitmq';

const router = express.Router();

const findAllTasksByUserId = async (req: CustomRequest, res: CustomResponse) => {
  const { user, models } = req;
  if (!user) {
    res.utils?.error('请重新登录');
    return;
  }
  const { id } = user as any;
  const tasks = await models!.taskManager.findTasksByUserId(id);
  
  res.utils!.data(tasks);
};

const getTaskDetailByTaskId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success get task detail' });
};

const createTask = async (req: CustomRequest, res: CustomResponse) => {
  const {type, fileIds} = req.body;
  const { models, config, appLog, user } = req;
  // model create
  const result = await models!.taskManager.createTasks(type, fileIds, (user as any).id)
  
  if (result.success) {
    res.utils?.data({message: '任务创建成功'});
  } else {
    res.utils?.error('任务创建失败');
    return;
  }

  if (type === 'recognize') {
    // 找到存储的audio信息
    const audioFileList = await models?.audioManager.findAudiosByIds(fileIds);
    if (!audioFileList) {
      appLog?.error('找不到对应的文件');
      // TODO update task status

      return;
    }

    const tasksInfo = result.info!;
    tasksInfo.map((taskInfo) => {
      const { taskId, audioId } = taskInfo;
      const audioInfo = audioFileList.find((audioInfo) => audioInfo.id === audioId);
      const transcribeInfo = {
        taskId,
        filePath: audioInfo?.path,
      }
      const rabbitMQ = RabbitMQ.getInstance(config!, appLog!);
      rabbitMQ.sendQueueMessage(
        'transcribe',
        JSON.stringify(transcribeInfo),
        (e: any) => appLog?.error(e),  
      )
    })
  }
};


const deleteTask = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success delete task' });
};

router.get('/api/task/list', mustBeAuthenticated, findAllTasksByUserId);
router.get(
  '/api/task/detail/:taskId',
  mustBeAuthenticated,
  getTaskDetailByTaskId
);
router.post('/api/task/create', mustBeAuthenticated, createTask);
router.delete('/api/task/:taskId', mustBeAuthenticated, deleteTask);

export default router;
