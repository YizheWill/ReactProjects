const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:userid", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .populate("followers", "_id name")
    .populate("following", "_id name")
    //don't need the password
    .then((user) => {
      Post.find({ postedBy: req.params.userid })
        // .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ err });
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      res.status(404).json({ error: err + "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  const followerId = req.user._id;
  const toFollowId = req.body.toFollow;

  User.findByIdAndUpdate(
    toFollowId,
    {
      $push: { followers: followerId },
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      if (err) {
        return res.status(404).json({ Error: "User not found" });
      } else {
        User.findByIdAndUpdate(
          followerId,
          {
            $push: { following: toFollowId },
          },
          {
            new: true,
            useFindAndModify: false,
          }
        )
          .select("-password")
          .then((result2) => console.log("get the logged in user", result2))
          .catch((err) => {
            console.log("cannot find the follower");
            return res.status(422).json({ err });
          });
        return res.json(result);
      }
    }
  );
});
router.delete("/deleteuser", requireLogin, (req, res) => {
  User.findByIdAndDelete(req.user._id)
    .then((user) => {
      user.remove();
      res.json();
    })
    .catch((err) => console.log(err));
});
router.put("/updatephoto", requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id)
    .then((user) => {
      user.pic = req.body.pic;
      user.save();
    })
    .then((res) => res.json)
    .catch((err) => console.log(err));
});

router.put("/unfollow", requireLogin, (req, res) => {
  const followerId = req.user._id;
  const toFollowId = req.body.toFollow;

  User.findByIdAndUpdate(
    toFollowId,
    {
      $pull: { followers: followerId },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(404).json({ Error: "User not found" });
      } else {
        User.findByIdAndUpdate(
          followerId,
          {
            $pull: { following: toFollowId },
          },
          {
            new: true,
          }
        )
          .then((result2) => console.log("get the logged in user"))
          .catch((err) => {
            console.log("cannot find the follower");
            return res.status(422).json({ err });
          });
        return res.json(result);
      }
    }
  );
});

router.post("/fetchusers/:name", (req, res) => {
  let userPattern = new RegExp("^" + req.params.name);
  console.log(userPattern);
  User.find({ name: { $regex: userPattern } })
    .then((user) => {
      if (!user) {
        return res.json({ info: "no such user" });
      }
      console.log(user);
      res.json(user);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
