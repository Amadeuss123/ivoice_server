import passport from "passport";
import { Strategy as PassportLocalStrategy } from 'passport-local';
import appLog from "@lib/log/app-log";
import { CustomRequest } from "@lib/interface";
import { comparePassword } from "@utils/hash";

function enableLocalStrategy() {
  appLog.info('Enabling local authentication strategy');
  passport.use(
    new PassportLocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'hashPassword',
      },
      async function passportLocalStrategyHandler(req: CustomRequest, username: string, hashPassword, done) {
        const { models } = req;
        const user = await models!.userManager.findUserByUsername(username);
        const verifiedNum = await models!.cacheManager.getSignInVerifiedNum(username);
        if (!user) {
          return done(null, false, {message: 'wrong username or password'});
        }
        if (!verifiedNum) {
          return done(null, false, {message: 'network error! please signin again'});
        }
        const isMatch = comparePassword(hashPassword, user.hashPassword, verifiedNum);
        if (isMatch) {
          (req.session as any).user = user;
          return done(null, {
            id: user.id,
            username: user.username,
            phone: user.phone
          });
        }
        return done(null, false, {message: 'wrong username or password'});
      }
    )
  )
}

export {
  enableLocalStrategy,
}
