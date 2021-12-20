import { CustomRequest, CustomResponse } from '@lib/interface';
import { generateRandomHexNum } from '@utils/number';
import express from 'express';

const router = express.Router();

const getAppContext = (req: CustomRequest, res: CustomResponse) => {
  const { config } = req;
  const currentUser = req.isAuthenticated() && req.user 
    ? {
      id: (req.user as any).id,
      username: (req.user as any).username,
      phone: (req.user as any).phone,
    } : null;
  
  return res.utils!.data({
    currentUser,
    config: {
      baseUrl: config?.get('baseUrl'),
      publicUrl: config?.get('publicUrl'),
    },
  })
}

const getVerifiedNum = (req: CustomRequest, res: CustomResponse) => {
  const verifiedNum = generateRandomHexNum();
  res.utils!.data(verifiedNum);
}

router.get('/api/context', getAppContext);
router.get('/api/verifiedNum', getVerifiedNum);

export default router;
