const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: String,
  expireTime: Date,
  pic: String,
  // add pic to the schema, pic is not required, so it's fine i guess
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

mongoose.model("User", userSchema);
