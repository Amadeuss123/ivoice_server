const generateRandomNum = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min));
};

export {
  generateRandomNum,
};

