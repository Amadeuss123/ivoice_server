import Config from "@lib/config";
import { Connection, connect, Channel } from 'amqplib';
import AppLogger from "@lib/log/logger";

let client: RabbitMQ;

export default class RabbitMQ {
  private host: string;
  private open: any;
  private constructor(config: Config) {
    this.host = config.get('rabbitMQUri');
    this.open = connect(this.host);
  }
  public sendQueueMessage(
    queueName: string,
    message: string,
    errCallback: Function
  ) {
    this.open
      .then((connection: Connection) => connection.createChannel())
      .then((channel: Channel) => 
        channel
        .assertQueue(queueName)
        .then((ok) => channel.sendToQueue(queueName, Buffer.from(message), {
          persistent: true,
        }))
        .then((value) => {
          if (value) {
            channel.close();
          }
        })
        .catch((e) => {
          setTimeout(() => {
            if (channel) {
              channel.close();
            }
          }, 500);
          errCallback(e);
        })
      ).catch((e: any) => {
        errCallback(e);
      })
  }

  public onReceiveQueueMessage(
    queueName: string,
    receiveCallback: Function,
    errCallback: Function
  ) {
    this.open
      .then((connection: Connection) => connection.createChannel())
      .then((channel: Channel) => channel.assertQueue(queueName).then((ok) =>
        channel.consume(queueName, (message) => {
          if (message !== null) {
            const data = message.content.toString();
            channel.ack(message);
            receiveCallback(data);
          }
        })  
      ))
      .catch((e: any) => {
        errCallback?.(e);
      })
      
  }

  public static getInstance(config: Config, appLog: AppLogger) {
    if (!client) {
      client = new RabbitMQ(config);
      appLog.info('RabbitMQClient 创建成功');
    }
    return client;
  }
}