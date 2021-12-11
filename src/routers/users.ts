import mustBeAuthenticated from '../middlewares/authenticated';
import express from 'express';
import { CustomRequest, CustomResponse } from '@lib/interface';

const router = express.Router();

const modifyUserInfo = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success modify' });
};

router.post('/api/user/modify', mustBeAuthenticated, modifyUserInfo);

export default router;
