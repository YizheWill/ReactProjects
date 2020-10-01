const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy" /*select */, "_id name")
    .populate("comments.commentPostedBy", "_id name")
    //如果我们不写populate就会出现返回的posts中 postedBy的这个对象只有一个id，
    //我们其实需要的是作者的相关信息，所以此处要把postedBy扩展开，取得其相关的用户对象
    //第二个参数（select后面的部分）是一个告诉db，我们只需要这个用户的其中两项信息，一个是id，
    //一个是name，不需要看到密码那些东西，是个filter的工具。
    .then((posts) => {
      res.json({ posts });
      //? 为什么这个地方是res.json 而不是post.json，res是不是一个保留关键字？
    })
    .catch((err) => {
      console.log(err);
    });
});
router.put("/like", requireLogin, (req, res) => {
  console.log("user id is ", req.user._id);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true, useFindAndModify: false }
  )
    .populate("postedBy", "_id name")
    .populate("comments.commentPostedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
// ? put和post的区别是什么？

//？这段逻辑稍微复杂一些，需要重新看
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true, findByIdAndUpdate: false }
  )
    .populate("postedBy", "_id name")
    .populate("comments.commentPostedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        console.log(result);
        res.json(result);
      }
    });
});
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    commentPostedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
      findByIdAndUpdate: false,
    }
  )
    .populate("comments.commentPostedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        console.log(result);
        res.json(result);
      }
    });
});
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    return res
      .status(422)
      .json({ error: "please have a title and some content" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/myfollowing", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.commentPostedBy", "_id name")
    .then((posts) => {
      console.log(posts);
      return res.json(posts);
    })
    .catch((err) => console.log(err));
});
router.delete("/deleteuserposts/:userid", (req, res) => {
  Post.find({ postedBy: req.params.userid })
    .then((posts) => {
      console.log("deleting posts", posts);
      posts.forEach((item) => item.remove());
      res.json();
    })
    .catch((err) => console.log(err));
});
router.delete("/deletepost/:postid", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postid })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      }
      //我觉得这段代码可以在前段实现，因为delete button正常来说也不是谁都能看到就好。
    });
});
router.put("/deletecomment", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: req.body.commentId } },
    },
    { new: true, useFindAndModify: false }
  )
    .populate("comments.commentPostedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        return res.json(result);
      }
    });
});
module.exports = router;
//export这个的原因见app.js末段
