// untuk menghandle router table user

const express = require('express');
const userctrl = require('../controllers/userctrl');
const midAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const userrouter = express.Router();
userrouter
  .get('/user', userctrl.getlist)
  .get('/mydetails', midAuth, userctrl.getdetail)
  .get('/detail/:id', userctrl.detailById)
  .post('/user', upload, userctrl.insert)
  .post('/login', userctrl.login)
  .post('/register', userctrl.register)
  .delete('/user/:id', midAuth, userctrl.del)
  .put('/user', midAuth, upload, userctrl.update)
  .put('/useremail', midAuth, userctrl.updateEmail)
  .put('/userpw', midAuth, userctrl.updatePw);

module.exports = userrouter;
