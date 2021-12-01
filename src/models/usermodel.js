/* eslint-disable max-len */
// menghandle query table user
const db = require('../config/db');

const usermodel = {
  gettotal: () => new Promise((resolve, reject) => {
    db.query('select * from user', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length);
      }
    });
  }),
  getlist: (search, field, sort, limit, offset) => new Promise((resolve, reject) => {
    db.query(`select * from user where username like '%${search}%' order by ${field} ${sort} limit ${limit} offset ${offset}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  login: (body) => new Promise((resolve, reject) => {
    db.query(`select * from user where email="${body.email}"`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  register: (body, pass, img) => new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO user (img, username, email, password)
        VALUE (
          '${img}','${body.username}','${body.email}','${pass}'
        )`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  checkregister: (body) => new Promise((resolve, reject) => {
    db.query(`select * from user where email='${body.email}' `, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  getdetail: (id) => new Promise((resolve, reject) => {
    db.query(`select * from user where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  detailByName: (name) => new Promise((resolve, reject) => {
    db.query(`select * from user where username='${name}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  getimg: (id) => new Promise((resolve, reject) => {
    db.query(`select img from user where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  insert: (img, body, password) => new Promise((resolve, reject) => {
    const {
      username, email, phone, tag,
    } = body;
    db.query(`insert into user (img, username, email, password, phone, tagName) value ('${img}', '${username}', '${email}', '${password}', '${phone}', '${tag}')`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  del: (id) => new Promise((resolve, reject) => {
    db.query(`delete from user where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  updatePw: (id, pw) => new Promise((resolve, reject) => {
    db.query(`update user set password="${pw}" where id="${id}"`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  updateEmail: (id, email) => new Promise((resolve, reject) => {
    db.query(`update user set email="${email}" where id="${id}"`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  update: (id, img, body) => new Promise((resolve, reject) => {
    const {
      username, phone, tagName, bio,
    } = body;
    db.query(`update user set img="${img}", username="${username}", phone="${phone}", tagName="${tagName}", bio="${bio}" where id="${id}"`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};

module.exports = usermodel;
