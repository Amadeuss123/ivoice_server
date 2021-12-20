import { CustomRequest, CustomResponse } from '@lib/interface';
import { generateRandomHexNum } from '@utils/number';
import express, { NextFunction } from 'express';
import passport from 'passport';

const router = express.Router();

const handleSignIn = (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
  const handleAuth = (error: any, user: any, info: any) => {
    const message = info?.message;
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.utils!.unauthorized(message);
    }

    return req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.utils!.data('登录成功');
    })
  };

  if (req.body.username && req.body.hashPassword) {
    return passport.authenticate('local', handleAuth)(req, res, next);
  }

  return res.utils!.error('unknown error');
  
};

const getVerifiedNum = async (req: CustomRequest, res: CustomResponse) => {
  const { models, params: {username}} = req;
  const verifiedNum = await models!.cacheManager.generateSignInVerifiedNum(username);
  res.utils!.data(verifiedNum);
};

router.post('/api/signin', handleSignIn, (req, res: CustomResponse) => res.utils!.data());
router.get('/api/signin/verifiedNum/:username', getVerifiedNum);

export default router;
