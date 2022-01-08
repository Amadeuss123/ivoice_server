import { CustomRequest, CustomResponse } from '@lib/interface';
import express from 'express';

const router = express.Router();

const handleHandleSignUp = async (req: CustomRequest, res: CustomResponse) => {
  const { models, body } = req;
  const { username, hashPassword, phone, code } = body;

  const messageCode = await models!.cacheManager.getMessageCodeByPhone(phone);
  if (!messageCode) {
    return res.utils!.forbidden('验证码已过期， 请重新发送');
  }
  if (messageCode !== code) {
    return res.utils!.forbidden('验证码错误');
  }

  const currentUser = await models!.userManager.findUserByPhone(phone);
  if (currentUser) {
    return res.utils!.forbidden('该手机号已存在');
  }

  const user = await models!.userManager.createUser({
    username,
    hashPassword,
    phone,
  });

  return res.utils!.data({ message: 'success signup' });
};

const handleSendMessageCode = (req: CustomRequest, res: CustomResponse) => {
  const { models, params } = req;
  const { phone } = params;
  const phoneTestRegexp = /^1\d{10}/;
  if (!Number(phone) || !phoneTestRegexp.test(phone)) {
    res.utils!.error('手机号有错');
    return;
  }
  const code = models!.cacheManager.generateMessageCode(params.phone);

  // TODO 由第三方发送验证码

  res.utils!.data();
};

router.post('/api/signup', handleHandleSignUp);
router.get('/api/signup/sendCode/:phone', handleSendMessageCode);

export default router;
