import Config from '@lib/config';
import appLog from '@lib/log/app-log';
import AppLogger from '@lib/log/logger';
import Client from 'ftp';
import { promisify } from 'util';
import fs from 'fs';

let ftpClientInstance: FTPClient | null = null;
export default class FTPClient {
  private host: string;
  private port: number;
  private user: string;
  private password: string;
  private destDir: string;
  private client: Client;

  private constructor(config: Config) {
    this.host = config.get('ftpServerHost') ?? 'localhost';
    this.port = config.get('ftpServerPort') ?? 21;
    this.user = config.get('ftpUser') ?? 'root';
    this.password = config.get('ftpPassword') ?? '123';
    this.destDir = config.get('storeDirPath') ?? 'upload';
    this.client = new Client();
  }

  public static getInstance(config: Config) {
    if (!ftpClientInstance) {
      ftpClientInstance = new FTPClient(config);
      return ftpClientInstance;
    }
    return ftpClientInstance;
  }

  public onClientConnectReady(fn: () => void) {
    this.client.on('ready', () => {
      this.client.cwd(this.destDir, (error) => {
        if (error) {
          appLog.error(error.message);
          return;
        }
        fn()
      })
    })
  }

  public connect() {
    this.client.connect({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
    })
  }

  public async put(input: string, dest: string) {
    return new Promise((resolve, reject) => {
      this.client.put(input, dest, (error) => {
        if (error) {
          reject(error.message);
        }
        appLog.info('File was uploaded remote successfully');
        resolve('');
      })
    })
  }

  public async get(path: string, localStorePath: string) {
    return new Promise((resolve, reject) => {
      this.client.get(path, (error, stream) => {
        if (error) {
          reject(error.message);
        }
        stream.once('close', () => {
          this.client.end();
          appLog.info('File was download successfully');
          resolve('');
        });
        stream.pipe(fs.createWriteStream(localStorePath))
      })
    })
  }

  public end() {
    this.client.end()
  }
}

// export default function createFTPClient(config?: Config, appLog?: AppLogger) {
//   const host = config?.get('ftpServerHost') ?? 'localhost';
//   const port = config?.get('ftpServerPort') ?? 21;
//   const user = config?.get('ftpUser') ?? 'root';
//   const password = config?.get('ftpPassword') ?? '123';
//   const dest = config?.get('ftpUploadDest') ?? 'ivoice';
//   const client = new Client();

//   client.on('ready', () => {
//     if (!appLog) {
//       console.log('FTP Client has been connected successfully');
//       return;
//     }
//     appLog.info('FTP Client has been connected successfully');
//     client.cwd(dest, (err) => {

//     })
//   })

//   client.connect({
//     host,
//     port,
//     user,
//     password,
//   })

//   return client;
// }