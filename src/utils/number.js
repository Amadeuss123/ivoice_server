const generateRandomNum = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

module.exports = {
  generateRandomNum,
};
