const mustBeAuthenticated = require('../middlewares/authenticated');

const router = require('express').Router();

const uploadAudio = (req, res) => {
  res.utils.data({ message: 'success upload audio' });
};

const getAudioDetailByAudioId = (req, res) => {
  res.utils.data({ message: 'success get audio detail' });
};

const deleteAudioByAudioId = (req, res) => {
  res.utils.data({ message: 'success delete audio' });
};

router.put('/api/audio/upload', mustBeAuthenticated, uploadAudio);
router.get(
  '/api/audio/detail/:audioId',
  mustBeAuthenticated,
  getAudioDetailByAudioId
);
router.delete('/api/audio/:audioId', mustBeAuthenticated, deleteAudioByAudioId);

module.exports = router;
