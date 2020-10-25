const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = {
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  comments: [
    { text: String, commentPostedBy: { type: ObjectId, ref: "User" } },
    //这个type是来自与line 2
  ],
  // 发现了一个mongoose的规则，也就是说可以直接text:String,但是如果需要指定为required，那么就
  // 转化成一个object
  likes: [{ type: ObjectId, ref: "User" }],
  postedBy: {
    type: ObjectId,
    //id of the user
    ref: "User",
    //refered to User Model
  },
};

mongoose.model("Post", postSchema);
