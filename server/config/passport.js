import User from '../database/models/User';

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { default: config } = require('.');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;
const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        throw error;
      }
    })
  );
};

export default passportConfig;
