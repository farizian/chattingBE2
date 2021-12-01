const jwt = require('jsonwebtoken');
const { failed } = require('../helper/response');
const env = require('../helper/env');

const midAuth = (req, res, next) => {
  const { headers } = req;
  const { token } = headers;
  jwt.verify(token, env.pwtoken, (err, decoded) => {
    if (err) {
      failed(res, 400, 'Token salah');
    } else {
      req.userId = decoded.id;
      next();
    }
  });
};

module.exports = midAuth;
