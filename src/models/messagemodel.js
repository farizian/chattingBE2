/* eslint-disable max-len */
// menghandle query table message
const db = require('../config/db');

const messagemodel = {
  gettotal: () => new Promise((resolve, reject) => {
    db.query('select * from message', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length);
      }
    });
  }),
  getmsg: (sender, receiver) => new Promise((resolve, reject) => {
    db.query(
      `SELECT m.id, m.sender, sender.username as senderName, sender.img as senderImg,
      m.receiver, receiver.username, receiver.img, m.text_msg,
      m.created FROM message as m
      left join public.user as sender on m.sender = sender.id
      left join public.user as receiver on m.receiver = receiver.id  WHERE (sender =${sender} AND receiver = ${receiver}) OR (sender=${receiver} AND receiver=${sender}) order by id asc`,
      (err, result) => {
        if (err) {
          // console.log(err)
          reject(err);
        } else {
          // console.log(result)
          resolve(result);
        }
      },
    );
  }),
  insert: (payload) => new Promise((resolve, reject) => {
    const {
      sender, receiver, msg,
    } = payload;
    db.query(`insert into message (sender, receiver, text_msg) values ('${sender}', '${receiver}', '${msg}')`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  delMsg: (id) => new Promise((resolve, reject) => {
    db.query(`delete from message where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  update: (body) => new Promise((resolve, reject) => {
    const { sender, receiver, msg } = body;
    db.query(`update message set text_msg="${msg}" where
    (sender='${sender}' and receiver='${receiver}')
    OR
    (sender='${receiver}' and receiver='${sender}') `,
    (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};

module.exports = messagemodel;
