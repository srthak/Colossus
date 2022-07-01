const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/newSong";
mongoose.connect(url, { useNewUrlParser: true }, () => {
  console.log("mongoose connectivity...");
});
