const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged" });
  }
  //authorization should be like "Bearer <token>"
  const token = authorization.replace("Bearer ", "");
  //此处可以通过这个authorization的加密码“Bearer ...", 利用verify反推出里面隐藏的ID值
  //这个id值是payload._id,我们在加密signin的时候用的id和我们的JWT_SECRET混合，得到了
  //一个新的字符串，which is token，当然token也可找到id，找到id之后，用User.findById就能定位到
  //document，然后得到data。
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = payload;
    //记住，此处必须是_id,否则读不出来
    //很奇怪啊，我第二次用id可以读出来，但是_id 读不出来
    User.findById(id)
      .then((userData) => {
        req.user = userData;
        next();
        //这个next必须放到then这个里面，如果放在外面next的话就会出现，异步问题
        //整个这个findbyid会用一定的时间，会出现这面还在findbyid，那面已经next了的情况
        //也就是user没有被保存
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
