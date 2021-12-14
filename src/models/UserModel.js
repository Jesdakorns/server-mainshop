var express = require('express');
var db = require('../../config/database');


let UserModel = {};

UserModel.all = () => {
      return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users", function (err, result, fields) {
                  if (err) {
                        return reject(err);
                  };
                  return resolve(result);
            });
      });
};

UserModel.insert = (data) => {
      const str = `"${Object.values(data)}"`;
      let changesStr = str.split(',').join('","')
      return new Promise((resolve, reject) => {
            db.query(`INSERT INTO users (${Object.keys(data)}) VALUES (${changesStr})`, function (err, result, fields) {
                  if (err) {
                        return resolve(false);
                  };
                  return resolve(true);
            });
      });
};

module.exports = UserModel