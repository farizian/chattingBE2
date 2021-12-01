// const db = require('../config/db');
const { failed } = require('../helper/response');
const models = require('../models/usermodel');

const authorization = {
  isAdmin: (req, res, next) => {
    try {
      const id = req.userId; // url parameter untuk mengambil id
      models.getdetail(id).then((result) => {
        if (result[0].status === 0) {
          next();
        } else {
          failed(res, 401, 'Anda tidak diizinkan, silahkan hubungi admin.');
        }
      })
        .catch((err) => {
          failed(res, 408, err);
        });
    } catch (err) {
      failed(res, 500, err);
    }
  },
};

module.exports = authorization;
