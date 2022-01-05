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
  size: number,
  format: string,
}

export type AudioInfo = AudioAnalyseInfo & {
  name: string,
  localStorePath: string,
  ftpStorePath: string,
}

export type AudioPath = {
  audioPath: string,
  name: string,
}
