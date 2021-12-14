const jwt = require('jsonwebtoken')  // ใช้งาน jwt module
const bcrypt = require('bcrypt');
const UserModel = require('../../models/UserModel');

class LoginController {
      static async index(req, res) {
            try {
                  let users = await UserModel.all();
                  let getUser = Object;
                  let isEmail = false;
                  let isPassword = false;
                  users.map(user => {
                        if (req.body.email === user.email) {
                              isEmail = true;
                              isPassword = bcrypt.compare(req.body.password, `${user.password}`);
                              getUser = {
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    image: user.image,
                                    phone: user.phone
                              }
                        }
                  });
                  if (isEmail) {
                        isPassword.then((password) => {
                              if (password) {
                                    jwt.sign(getUser, "secretkey", { expiresIn: 60 * 60 * 24 * 7 }, (err, token) => {
                                          res.json({
                                                'status': {
                                                      'success': true,
                                                      'message': null,
                                                      'operationType': 'login'
                                                },
                                                token
                                          },200);
                                    });
                              } else {
                                    res.json({
                                          'status': {
                                                'success': false,
                                                'message': 'email or password incorrect',
                                                'operationType': 'login'
                                          },
                                          token: ''
                                    });
                              }
                        });
                  } else {
                        res.json({
                              'status': {
                                    'success': false,
                                    'message': 'email or password incorrect',
                                    'operationType': 'login'
                              },
                              token: ''
                        });
                  }
            } catch (e) {
                  console.log(e);
            }
      }
}
module.exports = LoginController;