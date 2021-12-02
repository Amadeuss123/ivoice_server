function mustBeAuthenticated(req, res, next) {
  // if (req.isAuthenticated()) {
  //   return next();
  // }
  // return res.utils.unauthorized();
  return next();
}

module.exports = mustBeAuthenticated;
