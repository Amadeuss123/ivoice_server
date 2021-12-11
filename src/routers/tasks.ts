import mustBeAuthenticated from '../middlewares/authenticated';
import express from 'express';
import { CustomRequest, CustomResponse } from '@lib/interface';

const router = express.Router();

const getAllTasksByUserId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success get tasks' });
};

const getTaskDetailByTaskId = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success get task detail' });
};

const createTask = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success create task' });
};

const deleteTask = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success delete task' });
};

router.get('/api/tasks/list', mustBeAuthenticated, getAllTasksByUserId);
router.get(
  '/api/task/detail/:taskId',
  mustBeAuthenticated,
  getTaskDetailByTaskId
);
router.post('/api/task/create', mustBeAuthenticated, createTask);
router.delete('/api/task/:taskId', mustBeAuthenticated, deleteTask);

export default router;
