const mustBeAuthenticated = require('../middlewares/authenticated');

const router = require('express').Router();

const modifyUserInfo = (req, res) => {
  res.utils.data({ message: 'success modify' });
};

router.post('/api/user/modify', mustBeAuthenticated, modifyUserInfo);

module.exports = router;
