export enum TaskStatus {
  Waiting = 0,
  Doing = 1,
  Success = 2,
  Fail = 3,
}

export enum TaskType {
  Recognize = 0,
  Denoise = 1,
}

export interface TranscribeResultSegment {
  segment: {
    start: number,
    end: number,
  },
  label: number,
  word: string,
}

export type TranscribeResult = TranscribeResultSegment[];
