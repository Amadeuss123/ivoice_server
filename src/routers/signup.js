const router = require('express').Router();

const handleHandleSignUp = (req, res) => {
  res.utils.data({ message: 'success signup' });
};

router.post('/api/signup', handleHandleSignUp);

module.exports = router;
