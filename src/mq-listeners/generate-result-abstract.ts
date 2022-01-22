import Config from "@lib/config";
import GRPCClient from "@lib/grpc/client";
import appLog from "@lib/log/app-log";
import AppLogger from "@lib/log/logger";
import RabbitMQ from "@lib/rabbitmq/rabbitmq";
import ModelsManager from "@manager";

export function addGenerateResultAbstractListener(
  config: Config,
  models: ModelsManager,
  appLog: AppLogger,
) {
  const rabbitMQ = RabbitMQ.getInstance(config, appLog);
  rabbitMQ.onReceiveQueueMessage(
    'abstract',
    (message: string) => generateAbstract(message, config, models),
    (e: any) => appLog.error(e),
  );
}

async function generateAbstract(message: string, config: Config, models: ModelsManager) {
  const endPoint = config.get('grpcClient');
  const obj = JSON.parse(message);
  const { taskId, content } = obj;
  const grpcClient = new GRPCClient(endPoint);
  try {
    const resultAbstract = await grpcClient.generateResultAbstract(content);
    await models.resultManager.updateTaskResultByTaskId(taskId, {abstract: resultAbstract});
  } catch (e) {
    appLog.error(e);
  }
}