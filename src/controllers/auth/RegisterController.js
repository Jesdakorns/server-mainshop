const bcrypt = require('bcrypt');
const UserModel = require('../../models/UserModel');
const date = require('date-and-time');
class RegisterController {
      static index(req, res) {
            const now = new Date();
            let isInsert;
            bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                  isInsert = UserModel.insert({
                        'email': req.body.email,
                        'password': encrypted,
                        'name': req.body.name,
                        'phone': req.body.phone,
                        'image': req.body.image,
                        'sex': req.body.sex,
                        'created_at': date.format(now, 'YYYY-MM-DD HH:mm:ss'),
                        'updated_at': date.format(now, 'YYYY-MM-DD HH:mm:ss')
                  });
                  isInsert.then((val) => {
                        if (val) {
                              res.json({
                                    'status': {
                                          'success': true,
                                          'message': null,
                                          'operationType': 'register'
                                    },
                                    'user': {
                                          'email': req.body.email,
                                          'name': req.body.name,
                                          'phone': req.body.phone,
                                          'image': req.body.image,
                                          'sex': req.body.sex,
                                          'created_at': date.format(now, 'YYYY-MM-DD HH:mm:ss'),
                                          'updated_at': date.format(now, 'YYYY-MM-DD HH:mm:ss')
                                    }
                              });
                        } else {
                              res.json({
                                    'status': {
                                          'success': false,
                                          'message': 'The contact email or password is already in use.',
                                          'operationType': 'register'
                                    }
                              });
                        }
                  });
            });
      }
}
module.exports = RegisterController;