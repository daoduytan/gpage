const { validationResult } = require('express-validator/check');
const passport = require('passport');

const { User } = require('../../models');

const authController = {
  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { password, ...rest } = req.body;

    const user = new User({
      ...rest,
    });

    await user.setPassword(password);
    await user.generalRefreshToken();

    return user
      .save()
      .then(userRes => res.json({ user: userRes.authToJson() }))
      .catch(error => {
        res.status(500).json({ status: false, errors: errors.mess });
      });
  },

  login: (req, res, next) =>
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.json({
            status: false,
            error: err,
          });
        }

        if (!user) {
          return res.status(404).json({
            status: false,
            error: info.message,
          });
        }

        req.session.refresh_token = user.refresh_token;

        console.log(' req.session', req.session);

        return res.json({
          status: true,
          user: user.authToJson(),
          token: user.generalToken(),
        });
      }
    )(req, res, next),

  // get user
  getUser: (req, res) => {
    const { _id, reload_user } = req;

    User.findById(_id).exec((error, user) => {
      if (error) return res.status(500).json({ status: false });

      // reload user
      if (reload_user) {
        req.reload_user = false;
        return res.json({
          status: true,
          user: user.authToJson(),
          token: user.generalToken(),
        });
      }

      return res.json({ status: true, user: user.authToJson() });
    });
  },
  updateFacebookAccount: (req, res) => {
    const { _id } = req;
    const update_date = Date.now();
    const facebookAcc = { ...req.body, update_date };

    User.findByIdAndUpdate(
      _id,
      { facebookAcc },
      { new: true },
      (error, user) => {
        if (error) {
          return res.status(500).json({ status: false });
        }

        return res.json({ user: user.authToJson() });
      }
    );
  },
  // logout out
  logout: (req, res) => {
    req.session.refresh_token = null;
    return res.json({ status: true });
  },
};

module.exports = authController;
