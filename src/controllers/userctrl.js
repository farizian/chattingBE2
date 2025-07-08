/* eslint-disable no-shadow */
/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const models = require('../models/usermodel');
const { success, failed, successlogin } = require('../helper/response');

const env = require('../helper/env');

const userctrl = {
// menampilkan list user
  getlist: (req, res) => {
    (async () => {
      try {
      const { query } = req;
      const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? 'username' : query.field;
      const sort = query.sort === undefined ? 'asc' : query.sort;
      const limit = query.limit === undefined ? 50 : query.limit;
      const offset = query.page === undefined || query.page === 1 ? 0 : (query.page - 1) * limit;
        
        const result = await models.getlist(search, field, sort, limit, offset);
        const total = await models.gettotal();
        const output = {
          data: result.rows,
          search,
          limit,
          page: query.page,
          totalpage: Math.ceil(total / limit),
        };
        success(res, output, 'get user data success');
      } catch (err) {
        failed(res, 500, err);
      }
    })();
  },
  // menampilkan detail table user berdasarkan id
  getdetail: (req, res) => {
    (async () => {
      try {
      const id = req.userId; // url parameter untuk mengambil id
        const result = await models.getdetail(id);
        success(res, result.rows, 'get user details success');
      } catch (err) {
        failed(res, 500, err);
      }
    })();
  },
  detailById: (req, res) => {
    (async () => {
      try {
      const { id } = req.params; // url parameter untuk mengambil id
        const result = await models.getdetail(id);
        success(res, result.rows, 'get user details success');
      } catch (err) {
        failed(res, 500, err);
      }
    })();
  },
  // insert data user
  insert: (req, res) => {
    (async () => {
      try {
      const { body } = req;
      const img = req.file.filename;
      const pw = bcrypt.hashSync(body.password, 10);
        const result = await models.insert(img, body, pw);
        success(res, result, 'Input To User Data Success');
      } catch (err) {
        failed(res, 400, err);
      }
    })();
  },
  // login ke database
  login: (req, res) => {
    (async () => {
      try {
      const { body } = req;
        const result = await models.login(body);
        if (result.rows.length <= 0) {
          failed(res, 400, 'Email salah');
        } else {
          const user = result.rows[0];
          const userId = {
            id: user.id,
          };
          const token = jwt.sign(userId, env.pwtoken);
          const passwordHash = user.password;
          const pw = bcrypt.compareSync(body.password, passwordHash);
          if (pw === true) {
            successlogin(res, result, token);
          } else {
            failed(res, 404, 'password salah');
          }
        }
      } catch (err) {
        failed(res, 404, err);
      }
    })();
  },
  // register
  register: (req, res) => {
    (async () => {
      try {
      const { body } = req;
      const { email } = body;
      const img = 'default.png';
        
        try {
          const result = await models.checkregister(body);
          if (result.rows.length > 0 && result.rows[0].email) {
          failed(res, 401, 'email sudah digunakan');
            return;
        }
        } catch (checkErr) {
          // Email not found, proceed with registration
        }
        
        if (!email || !body.password) {
          failed(res, 401, 'harap masukkan email/password anda');
        } else {
          const hash = await bcrypt.hash(body.password, 10);
          const result2 = await models.register(body, hash, img);
          success(res, result2);
        }
      } catch (error) {
        failed(res, 401, error);
      }
    })();
  },
  // delete data user
  del: async (req, res) => {
    (async () => {
      try {
      const { id } = req.params;
      const imgName = await models.getimg(id);
      const imgPath = `./src/img/${imgName.rows[0].img}`;
      fs.unlink(imgPath, ((errImg) => {
        if (errImg) {
          (async () => {
            try {
              const result = await models.del(id);
            success(res, result, 'Delete User Data Success');
            } catch (err) {
              failed(res, 404, err);
            }
          })();
        } else {
          (async () => {
            try {
              const result = await models.del(id);
            success(res, result, 'Delete User Data Success');
            } catch (err) {
              failed(res, 404, err);
            }
          })();
        }
      }));
      } catch (err) {
        failed(res, 404, err);
      }
    })();
  },
  updatePw: async (req, res) => {
    (async () => {
      try {
      const { body } = req;
      const id = req.userId;
      const detail = await models.getdetail(id);
      const oldPwHash = detail.rows[0].password;
        
        const checkpw = await bcrypt.compare(body.oldpassword, oldPwHash);
        if (checkpw === true) {
          const pw = bcrypt.hashSync(body.password, 10);
          const result = await models.updatePw(id, pw);
          success(res, result, 'Update Password Success');
        } else {
          failed(res.status(404), 404, 'Wrong Password');
        }
      } catch (error) {
        failed(res, 500, error);
      }
    })();
  },
  updateEmail: (req, res) => {
    (async () => {
      try {
      const { body } = req;
      const id = req.userId;
        const result = await models.updateEmail(id, body.email);
        success(res, result, 'Update Email Success');
      } catch (error) {
        failed(res, 400, error);
      }
    })();
  },
  update: async (req, res) => {
    (async () => {
      try {
      const { body } = req;
      const id = req.userId;
      const imgName = await models.getimg(id);
      const imgPath = `./src/img/${imgName.rows[0].img}`;
      const img = !req.file ? imgName.rows[0].img : req.file.filename;
      if (!req.file) {
        const result = await models.update(id, img, body);
        success(res, result, 'Update User Data Success');
      } else if (imgName.rows[0].img === 'default.png') {
        const result = await models.update(id, img, body);
        success(res, result, 'Update User Data Success');
      } else {
        fs.unlink(imgPath, ((errImg) => {
          if (errImg) {
            (async () => {
              try {
                const result = await models.update(id, img, body);
                success(res, result, 'Update User Data Success');
              } catch (err) {
                failed(res, 400, err);
              }
            })();
          } else {
            (async () => {
              try {
                const result = await models.update(id, img, body);
                success(res, result, 'Update User Data Success');
              } catch (err) {
                failed(res, 400, err);
              }
            })();
          }
        }));
      }
      } catch (err) {
        failed(res, 500, err);
      }
    })();
  },
};

module.exports = userctrl;
