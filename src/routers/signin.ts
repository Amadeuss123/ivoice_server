import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';

const router = express.Router();

const handleSignIn = (req: CustomRequest, res: CustomResponse) => {
  res.utils!.data({ message: 'success signin' });
};

router.post('/api/signin', handleSignIn);

export default router;
