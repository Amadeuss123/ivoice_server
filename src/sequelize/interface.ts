export interface AudioCreateAttributes {
  name: string;
  path: string;
  userId: string;
  audioTime: number;
}

export interface AudioAttributes extends AudioCreateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CacheCreateAttributes {
  id: string;
  name: string;
  data: string;
  expireDate: Date;
}

export interface CacheAttributes extends CacheCreateAttributes {
  createdAt: Date;
}

export interface ResultsCreateAttributes {
  name: string;
  taskId: string;
  path: string;
}

export interface ResultsAttributes extends ResultsCreateAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export interface TasksCreateAttributes {
  audioId: string;
  taskType: number;
  status: number;
}

export interface TasksAttributes extends TasksCreateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersCreateAttributes {
  username: string;
  phone: string;
  hashPassword: string;
}

export interface UsersAttributes extends UsersCreateAttributes {
  id: string;
  signinAt: Date;
}



