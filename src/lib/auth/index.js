const passport = require('passport');
// const basic = require('./basic');
// const local = require('./local');
// const phoneLocal = require('./phone-local');

// The serializeUser/deserializeUser functions apply regardless of the strategy used.
// Given a user object, extract the id to use for session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializeUser takes the id from the session and turns it into a user object.
// This user object will decorate req.user
// Note: while passport docs only reference this function taking 2 arguments,
// it can take 3, one of which being the req object
// https://github.com/jaredhanson/passport/issues/743
// https://github.com/passport/www.passportjs.org/pull/83/files
passport.deserializeUser(async function (req, id, done) {
  try {
    const user = req.session.user;
    if (user && !user.disabled) {
      return done(null, user);
    }
    done(null, false);
  } catch (error) {
    done(error);
  }
});

/**
 * Register auth strategies (if configured)
 * @param {object} config
 * @param {object} models
 */
// eslint-disable-next-line no-unused-vars
async function authStrategies(config, models) {
  // basic();
  // local();
  // phoneLocal();
}

module.exports = authStrategies;
