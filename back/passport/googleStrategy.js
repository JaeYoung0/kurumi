const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {User,Image} = require('../models');

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback',
  }, async (accessToken, refreshToken, profile, cb) => {
    console.log('google profile', profile);
    try {
        
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'google' },
      });
      if (exUser) {
        
        cb(null, exUser);
      } else {
        const newUser = await User.create({
        //   email: profile._json && profile._json.google_account_email,
          nickname: profile.displayName,
          snsId: profile.id,
          provider: 'google',
        });


        await Image.create({
            src: profile.photos[0].value,
            UserId: newUser.id

        })
        cb(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};