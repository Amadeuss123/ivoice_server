const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffmpegPath);

console.log('ffmpeg ', ffmpeg);

ffmpeg.ffprobe('./upload/wayfaring.mp3', (err, data) => {
  console.log('error ', err);
  console.log('audioData', data);
});
