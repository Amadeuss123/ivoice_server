import fs from 'fs';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import P from 'pino';

class GRPCClient {
  private clientStub: any;

  public constructor(endPoint: string = 'localhost:9000') {
    const packageDefinition = protoLoader.loadSync('proto/ivoice.proto', {
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
    return this.clientStub.transcribeAudioFile({
      remoteFilePath: filePath
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
