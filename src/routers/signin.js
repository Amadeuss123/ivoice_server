const router = require('express').Router();

const handleSignIn = (req, res) => {
  res.utils.data({ message: 'success signin' });
};

router.post('/api/signin', handleSignIn);

module.exports = router;
