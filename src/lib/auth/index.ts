// const passport = require('passport');
import { CustomRequest } from '@lib/interface';
import ModelsManager from '@manager';
import passport from 'passport';
import Config from '../config';
// const basic = require('./basic');
import { enableLocalStrategy } from './local';
// const phoneLocal = require('./phone-local');

// The serializeUser/deserializeUser functions apply regardless of the strategy used.
// Given a user object, extract the id to use for session
passport.serializeUser(function (user, done) {
  done(null, (user as any).id);
});

// deserializeUser takes the id from the session and turns it into a user object.
// This user object will decorate req.user
// Note: while passport docs only reference this function taking 2 arguments,
// it can take 3, one of which being the req object
// https://github.com/jaredhanson/passport/issues/743
// https://github.com/passport/www.passportjs.org/pull/83/files
passport.deserializeUser(async function(req: CustomRequest, id: string, done: Function) {
  try {
    const user = (req.session as any).user;
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
 */
// eslint-disable-next-line no-unused-vars
async function authStrategies(config: Config, models: ModelsManager) {
  enableLocalStrategy();
  // basic();
  // local();
  // phoneLocal();
}

export default authStrategies;
