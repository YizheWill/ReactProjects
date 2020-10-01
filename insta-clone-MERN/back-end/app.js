const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const { MONGOURI } = require("./keys");
//如果不写这个userNewUrlParser/UnifiedTopology就会出现waring，好像直接parseURI这种形式要被deprecate了
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//应该是说会有返回值，succuess=>"connected" failed=>"err"
mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeah");
});
mongoose.connection.on("error", () => {
  console.log("err no", err);
});

require("./models/user");
require("./models/post");
app.use(express.json()); //这一步使上一步的auth中request的body变成json形式。而且这个必须写在
//require（./routes/auth)前面，否则会出错，具体原因要查一下。
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
