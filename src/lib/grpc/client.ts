import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

export default class GRPCClient {
  private clientStub: any;

  public constructor(endPoint: string = 'localhost:9000') {
    console.log('dirname ', __dirname);
    const packageDefinition = protoLoader.loadSync(path.join(__dirname, 'proto/ivoice.proto'), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })
    
    const fileTranscribeProto = grpc.loadPackageDefinition(packageDefinition)
      .ivoice
    
    const clientStub = new (fileTranscribeProto as any).IVoiceToolkit(endPoint, grpc.credentials.createInsecure());
    this.clientStub = clientStub;
  }

  public transcribeAudioFile(filePath: string) {
    return new Promise<string>((resolve, reject) => {
      const result: any[] = [];
      const serviceCall = this.clientStub.transcribeAudioFile({
        remoteFilePath: filePath
      });
      serviceCall.on('data', (segmentResult: any) => {
        result.push(segmentResult);
      });
      serviceCall.on('end', () => {
        resolve(JSON.stringify(result));
      });
      serviceCall.on('error', (error: Error) => {
        reject(error);
      })
    })

  }
}

// serviceCall.on('data', (pair: any) => {
//   console.log(pair);
// })

// serviceCall.on('error', (error: any) => {
//   console.log(error);
// })

// serviceCall.on('end', () => {
//   console.log('audioTranscribe end');
// })
