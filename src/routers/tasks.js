const mustBeAuthenticated = require('../middlewares/authenticated');

const router = require('express').Router();

const getAllTasksByUserId = (req, res) => {
  res.utils.data({ message: 'success get tasks' });
};

const getTaskDetailByTaskId = (req, res) => {
  res.utils.data({ message: 'success get task detail' });
};

const createTask = (req, res) => {
  res.utils.data({ message: 'success create task' });
};

const deleteTask = (req, res) => {
  res.utils.data({ message: 'success delete task' });
};

router.get('/api/tasks/list', mustBeAuthenticated, getAllTasksByUserId);
router.get(
  '/api/task/detail/:taskId',
  mustBeAuthenticated,
  getTaskDetailByTaskId
);
router.post('/api/task/create', mustBeAuthenticated, createTask);
router.delete('/api/task/:taskId', mustBeAuthenticated, deleteTask);

module.exports = router;
