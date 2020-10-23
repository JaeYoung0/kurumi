const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local"); //구조분해하면서 이름바꾸기
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },

      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: {
              email,
            },
          });

          if (!user) {
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다!" });
        } catch (error) {
          // 서버 에러 발생한 경우
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
