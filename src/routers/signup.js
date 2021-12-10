const router = require('express').Router();
const { generateRandomNum } = require('../utils/number');

const handleHandleSignUp = async (req, res) => {
  const { models, body } = req;
  const { username, hashPassword, phone, code } = body;

  const messageCode = await models.users.getMessageCodeByPhone(phone);
  if (!messageCode) {
    return res.utils.forbidden('验证码已过期， 请重新发送');
  }
  if (messageCode !== code) {
    return res.utils.forbidden('验证码错误');
  }

  const currentUser = await models.users.findUserByPhone(phone);
  if (currentUser) {
    return res.utils.forbidden('该手机号已存在');
  }

  const user = await models.users.createUser({
    username,
    hashPassword,
    phone,
    signinAt: new Date(),
  });

  return res.utils.data({ message: 'success signup' });
};

const handleSendMessageCode = (req, res) => {
  const { models, params } = req;
  const { phone } = params;
  const phoneTestRegrex = /^1\d{10}/;
  if (!Number(phone) || !phoneTestRegrex.test(Number(phone))) {
    res.utils.error('手机号有错');
    return;
  }
  const code = models.users.generateMessageCode(params.phone);

  // TODO 由第三方发送验证码

  res.utils.data();
};

router.post('/api/signup', handleHandleSignUp);
router.get('/api/signup/sendCode/:phone', handleSendMessageCode);

module.exports = router;
