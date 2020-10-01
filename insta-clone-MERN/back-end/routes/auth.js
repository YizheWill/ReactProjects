const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");
const sgMail = require("@sendgrid/mail");
const { send } = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

// router.get("/", (req, res) => {
//   res.send("HOME PAGE");
// });
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
    //status code 422收到信息，无法process,虽然这个status 422可以
    //不写，但写上是一个很好的习惯
  }
  //res.json({ message: "successfully posted" });
  //就等于send back了一条信息，好像就等于res.send(JSON(message))
  //要查一查
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) return res.status(422).json({ error: "Email Existed" });
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          pic,
          //add pic to the signup
        });
        user
          .save()
          .then((user) => {
            const msg = {
              to: user.email,
              from: "will.yizhewang@gmail.com",
              subject: "Sending a msg with twilio sendgrid",
              text: "easy job",
              html: "<strong>Hello World</strong>",
            };
            sgMail.send(msg);
            res.json({ message: "success" });
          })
          .catch((err) => {
            console.log("err No.", err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "all fields required" });
  }
  User.findOne({ email: email })
    .then((result) => {
      if (!result) {
        console.log("no such entry");
        return res.status(422).json({ error: "invalid email or pass" });
      } else {
        bcrypt.compare(password, result.password).then((didMatch) => {
          console.log("comparing");
          if (didMatch) {
            const token = jwt.sign({ id: result._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = result;
            res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else
            return res.status(422).json({ error: "invalid email or pass" });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
// router.get("/protected", requireLogin, (req, res) => {
//   res.send("Hello User");
// });

//sending reset password link to the user
router.post("/backend-reset-password", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.json({ ERROR: "no such user" });
    } else {
      require("crypto").randomBytes(48, function (err, buffer) {
        const token = buffer.toString("hex");
        user.token = token;
        user.expireTime = Date.now() + 3600000;
        user
          .save()
          .then((user) => {
            const msg = {
              to: user.email,
              from: "will.yizhewang@gmail.com",
              subject: "resetting you password",
              html: `<h1>reset password <a href="http://169.254.169.25:3000/reset/${token}">link to reset password</a></h1>`,
            };
            sgMail.send(msg);
            res.json({ message: "success" });
          })
          .catch((err) => {
            console.log("err No.", err);
          });
      });
    }
  });
});
//resetting the password
router.put("/resetpass", (req, res) => {
  const password = req.body.password;
  const { token } = req.body.token;
  console.log("Token is: ", token);
  User.findOne({ token: token }).then((user) => {
    if (!user || user.expireTime < Date.now()) {
      return res
        .status(422)
        .json({ error: "session timed out, try reset again. " });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        user.token = "";
        user.expireTime = "";
        user.save();
      })
      .then((result) => {
        console.log(result);
        res.send({ message: "password changed successfully" });
      })
      .catch((err) => console.log(err));
  });
});
module.exports = router;
// 我们把router export出去，而这个router其实就是一个中间件，负责分析请求的，我们只有一个app js，不可能把所有的
// request都写到那里面，这就等于是建立一个routes文件夹，把不同的routes的逻辑分开来写。
// 交通管理末段。
