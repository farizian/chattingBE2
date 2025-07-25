/* eslint-disable no-shadow */
/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
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
        console.log('📋 Getting user list...');
      const { query } = req;
      const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? 'username' : query.field;
      const sort = query.sort === undefined ? 'asc' : query.sort;
      const limit = query.limit === undefined ? 50 : query.limit;
      const offset = query.page === undefined || query.page === 1 ? 0 : (query.page - 1) * limit;
        
        console.log('🔍 Query params:', { search, field, sort, limit, offset });
        
        const result = await models.getlist(search, field, sort, limit, offset);
        console.log('📊 Query result:', result.rows?.length || 0, 'users found');
        
        const total = await models.gettotal();
        console.log('📈 Total users:', total);
        
        const output = {
          data: result.rows,
          search,
          limit,
          page: query.page,
          totalpage: Math.ceil(total / limit),
        };
        console.log('✅ Sending success response');
        success(res, output, 'get user data success');
      } catch (err) {
        console.error('❌ Error in getlist:', err);
        console.error('Stack trace:', err.stack);
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
      const img = req.file ? req.file.filename : 'default.png';
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
      // Note: File deletion from Supabase Storage should be implemented here
      // For now, just delete the user record
      const result = await models.del(id);
      success(res, result, 'Delete User Data Success');
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
      const img = !req.file ? imgName.rows[0].img : req.file.filename;
      
      // Note: Old file deletion from Supabase Storage should be implemented here
      // For now, just update the user record
      const result = await models.update(id, img, body);
      success(res, result, 'Update User Data Success');
      } catch (err) {
        failed(res, 500, err);
      }
    })();
  },
};

module.exports = userctrl;
