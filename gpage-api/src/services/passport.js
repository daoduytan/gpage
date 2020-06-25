const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models');

const message = {
  not_user: 'Tài khoản không tồn tại',
  invalid_password: 'Mật khẩu không đúng'
};

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: message.not_user });

        const isMatch = user.isValidPassword(password);

        if (!isMatch)
          return done(null, false, { message: message.invalid_password });

        return done(null, user);
      }
    )
  );
};
