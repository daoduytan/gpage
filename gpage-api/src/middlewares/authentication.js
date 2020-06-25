const jwt = require('jsonwebtoken');

// const { User } = require('../models');

// const message = {
//   not_authentication: 'Bạn chưa đăng nhập'
// };

// res error
// const resError = res =>
//   res.status(500).json({ status: false, message: message.not_authentication });

// verify token
// const verifyToken = (token, cb) =>
//   jwt.verify(token, process.env.SECRET_KEY, cb);

// refresh user
// const refreshUser = (req, res, next) => {
//   const { refresh_token } = req.session;

//   return verifyToken(refresh_token, (error, decode) => {
//     if (error) return resError(res);

//     const { email } = decode;

//     return User.findOne({ email }).exec((err, user) => {
//       if (err) return resError(res);

//       req._id = user._id;
//       req.reload_user = true;
//       return next();
//     });
//   });
// };

// authentication
// const authentication = (req, res, next) => {

//   const bearToken = req.headers.authorization;

//   if (typeof bearToken !== 'undefined') {
//     const token = bearToken.split(' ')[1];

//     return verifyToken(token, (error, decode) => {
//       if (error) {
//         return res
//           .status(404)
//           .json({ status: false, message: 'Tài khoản không tồn tại' });
//       }
//       const { uid } = decode;
//       req.uid = uid;
//       return next();
//     });
//   }
//   return res
//     .status(404)
//     .json({ status: false, message: 'Tài khoản không tồn tại' });
// };

const authentication = (req, res, next) => {
  req.uid = 'ddd';
  return next();
  // const bearToken = req.headers.authorization;

  // if (typeof bearToken !== 'undefined') {
  //   const token = bearToken.split(' ')[1];

  //   jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
  //     if (error)
  //       return res
  //         .status(500)
  //         .json({ status: false, message: 'No authentication' });
  //     const { uid } = decode;
  //     req.uid = uid;
  //     next();
  //   });
  // } else {
  //   res.status(500).json({ status: false, message: 'No authentication' });
  // }
};

module.exports = authentication;
