export interface AudioCreateAttributes {
  id: string;
  name: string;
  path: string;
  userId: string;
  audioTime: number;
}

export interface AudioAttributes extends AudioCreateAttributes {
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

export interface ResultCreateAttributes {
  content: string;
  taskId: string;
  path: string;
}

export interface ResultAttributes extends ResultCreateAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateAttributes {
  audioId: string;
  userId: string;
  taskType: number;
  taskStatus: number;
}

export interface TaskAttributes extends TaskCreateAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateAttributes {
  username: string;
  phone: string;
  hashPassword: string;
}

export interface UserAttributes extends UserCreateAttributes {
  id: string;
  signinAt: Date;
}

export interface UserTaskCreateAttributes {
  userId: string;
  taskId: string;
  taskStatus: number;
}

export interface UserTaskAttributes extends UserTaskCreateAttributes {}
