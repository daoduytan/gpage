const { body, check } = require('express-validator/check');

const { authentication } = require('../../middlewares');
const authController = require('./controller.auth');
const { User } = require('../../models');

const message = {
  invalid_email: 'Không phải định dạng email',
  exist_email: 'Email đã tồn tại',
  password_length: 'Password phải từ 8 đến 50 kí tự',
  name: 'Phải từ 8 đến 50 kí tự'
};

const authRouter = app => {
  // sign up
  app.post(
    '/api/auth/sign_up',
    [
      check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage(message.invalid_email)
        .custom(value => {
          return User.findOne({ email: value }).then(user => {
            if (user) {
              throw new Error(message.exist_email);
            }
          });
        }),

      body('password')
        .isLength({ min: 8, max: 50 })
        .withMessage(message.password_length),

      body('first_name')
        .isLength({ min: 1, max: 30 })
        .withMessage(message.name)
        .trim()
        .escape(),
      body('last_name')
        .isLength({ min: 1, max: 30 })
        .withMessage(message.name)
        .trim()
        .escape()
    ],
    authController.signup
  );

  // login
  app.post('/api/auth/login', authController.login);

  // get user
  app.get('/api/auth/load_user', authentication, authController.getUser);

  // update facebook
  app.post(
    '/api/auth/update_facebook_acc',
    authentication,
    authController.updateFacebookAccount
  );

  // logout
  app.get('/api/auth/logout', authController.logout);
};

module.exports = authRouter;
