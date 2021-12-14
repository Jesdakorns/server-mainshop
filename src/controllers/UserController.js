const jwt = require("jsonwebtoken"); // ใช้งาน jwt module
class UserController {
   static index(req, res) {
      jwt.verify(req.token, "secretkey", (err, auth) => {
         if (err) {
            res.sendStatus(403);
         } else {
            res.json({
               status: {
                  success: true,
                  message: null,
                  operationType: "get user",
               },
               auth,
            });
         }
      });
   }
   static all(req, res) {
      res.json({
         status: {
            success: true,
            message: null,
            operationType: "get user",
         },
         auth: "1",
      });
   }
}
module.exports = UserController;
