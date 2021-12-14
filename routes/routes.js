const express = require('express');
const route = express.Router();
const RegisterController = require('../src/controllers/auth/RegisterController');
const LoginController = require('../src/controllers/auth/LoginController');
const LogoutController = require('../src/controllers/auth/LogoutController');
const UserController = require('../src/controllers/UserController');



function verifyToken(req, res, next) {
      const bearerHeader = req.headers['authorization'];
      if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
      } else {
            res.sendStatus(401);
      }
}
// route.post('/register/user', RegisterController.getPassword);
route.post('/register', RegisterController.index);
route.post('/login', LoginController.index);
route.delete('/logout', LogoutController.index);
route.get('/user', verifyToken, UserController.index);
route.get('/userall', UserController.all);
module.exports = route;