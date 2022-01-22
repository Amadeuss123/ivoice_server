import Config from "@lib/config";
import AppLogger from "@lib/log/logger";
import RabbitMQ from "@lib/rabbitmq/rabbitmq";
import GRPCClient from "@lib/grpc/client";
import ModelsManager from "@manager";
import { TaskStatus } from "@const/task";

export function addTranscribeAudioFileListener(
  config: Config,
  models: ModelsManager,
  appLog: AppLogger
) {
  const rabbitMQ = RabbitMQ.getInstance(config, appLog);
  rabbitMQ.onReceiveQueueMessage(
    'transcribe',
    (message: string) => transcribeAudioFile(message, models, appLog, config),
    (e: any) => appLog.error(e), 
  )
}

async function transcribeAudioFile(
  data: string,
  models: ModelsManager,
  appLog: AppLogger,
  config: Config
) {
  const endPoint = config.get('grpcClient');
  const grpcClient = new GRPCClient(endPoint);
  const obj = JSON.parse(data);
  const { filePath, taskId } = obj;
  try {
    console.log('start transcribe ...');
    await models.taskManager.updateTaskStatus(taskId, TaskStatus.Doing);
    const transcribeResult = await grpcClient.transcribeAudioFile(filePath);
    console.log('transcribe Result ', transcribeAudioFile);
    
    const taskResult = {
      transcribeResult,
    }
    await models.resultManager.createTaskResult(taskId, taskResult)
    appLog.info('task executed successfully');
    
    const isSuccess = await models.taskManager.updateTaskStatus(taskId, TaskStatus.Success);
    if (!isSuccess) {
      appLog.info('task status update fail');
    }
    appLog.info('task status update successfully');

    // TODO 提醒用户任务执行成功
  
  }catch(e: any) {
    appLog.error(e);
    await models.taskManager.updateTaskStatus(taskId, TaskStatus.Fail);
  }

}