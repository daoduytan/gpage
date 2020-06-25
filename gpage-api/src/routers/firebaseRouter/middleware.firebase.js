const jwt = require('jsonwebtoken');

module.exports = {
  // authentication
  authentication: (req, res, next) => {
    const bearToken = req.headers.authorization;
    if (typeof bearToken === 'undefined') {
      return res
        .status(500)
        .json({ status: false, message: 'No authentication' });
    }

    const tokenRes = bearToken.split(' ')[1];

    return jwt.verify(tokenRes, process.env.SECRET_KEY, (error, decode) => {
      if (error)
        return res
          .status(500)
          .json({ status: 500, message: 'No authentication' });

      const { uid } = decode;
      req.uid = uid;
      return next();
    });
  },

  // customer with admin
  customerAdminRole: (req, res, next) => {},
};
