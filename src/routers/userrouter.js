// untuk menghandle router table user

const express = require('express');
const userctrl = require('../controllers/userctrl');
const midAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { authLimiter, generalLimiter } = require('../middleware/security');

const userrouter = express.Router();

// Apply rate limiting
userrouter.use('/login', authLimiter);
userrouter.use('/register', authLimiter);
userrouter.use(generalLimiter);

userrouter
  .get('/user', userctrl.getlist)
  .get('/mydetails', midAuth, userctrl.getdetail)
  .get('/detail/:id', userctrl.detailById)
  .post('/user', (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        // Handle upload error gracefully
        req.file = null;
      }
      next();
    });
  }, userctrl.insert)
  .post('/login', userctrl.login)
  .post('/register', userctrl.register)
  .delete('/user/:id', midAuth, userctrl.del)
  .put('/user', midAuth, (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        // Handle upload error gracefully
        req.file = null;
      }
      next();
    });
  }, userctrl.update)
  .put('/useremail', midAuth, userctrl.updateEmail)
  .put('/userpw', midAuth, userctrl.updatePw);

module.exports = userrouter;
