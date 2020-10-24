const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = (req, res, next) => {
  //外部来了一个请求，第一步先过middleware，middleware拦截之后，看header
  //如果没有header，或者是header中直接就没有authorization这一项，那么就直接报错，
  //理论依据是，此处必然是访问的敏感信息，所以才会加auth，也就是说在设计后台的时候，
  //就已经确定了，我们要在哪些route上放这个authorization，并不是所有的都放，比如一些
  //首页什么的肯定就是不放，但是不放的话，问题也来了，放和不放如果页面不一样该怎么做？





  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged" });
  }
  //authorization should be like "Bearer <token>"
  const token = authorization.replace("Bearer ", "");

  //走到这一步，就已经确定了，在header里面，传过来的时候，加入了authorization这个项目，
  //能拿到，但是，拿到了也有可能是无效的，因为用户很有可能会随便编个authorization就给你发
  //过来了，那样的话，肯定也不能通过，那怎么办？






  //此处可以通过这个authorization的加密码“Bearer ...", 利用verify反推出里面隐藏的ID值
  //这个id值是payload._id,我们在加密signin的时候用的id和我们的JWT_SECRET混合，得到了
  //一个新的字符串，which is token，当然token也可找到id，找到id之后，用User.findById就能定位到
  //document，然后得到data。
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    //开始verify这个用户信息，注意，如上文所说，这个token的密文中其实是隐藏了用户的id信息的，只不过是通过
    //一种加密方式给他隐藏起来了而已。解锁就能看到，而加密的密钥就是我们存在keys中的那个JWT_SECRET，所以，这个信息
    //是一定不能暴露在网上，在github上的，否则问题很大。
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
      //verify的过程也可能产生error，比如这就是个不合规的token，随便写的。。。
    }
    const { id } = payload;
    //走到这一步，我们就确定，这个id是合规的，那么就把这个ID读出来了，但是id格式合规就在服务器中一定存在么？也不一定，比如，如果用户删档了
    //这时候，就不可能再返回任何信息给他了。


    //记住，此处必须是_id,否则读不出来
    //很奇怪啊，我第二次用id可以读出来，但是_id 读不出来
    User.findById(id)
      .then((userData) => {
        req.user = userData;
        next();
        //最后一步，找到用户，把用户的信息放到req中去，传递给下一个function，这也正式为什么，这个东西叫做“中间件”的原因了

        //这个next必须放到then这个里面，如果放在外面next的话就会出现，异步问题
        //整个这个findbyid会用一定的时间，会出现这面还在findbyid，那面已经next了的情况
        //也就是user没有被保存
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
