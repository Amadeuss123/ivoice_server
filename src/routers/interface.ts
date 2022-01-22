import formidable, { File } from "formidable"

export interface SignUpBody {
  username: string;
  hashPassword: string;
  phone: string;
  code: string;
}

export type AudioAnalyseInfo = {
  sampleRate: number,
  channels: number,
  bitRate: number,
  duration: number,
  format: string,
}

export type AudioInfo = AudioAnalyseInfo & {
  id: string,
  name: string,
  localStorePath: string,
  storePath: string,
}

export type AudioPath = {
  audioPath: string,
  name: string,
}

export enum TaskStatus {
  doing = 0,
  success = 1,
  fail = 2,
}

export interface UploadParseResult {
  files: File[],
}