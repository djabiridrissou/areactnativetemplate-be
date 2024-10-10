import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

const passportConfig = (passport: any) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.user.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    })
  );
};

export default passportConfig;
