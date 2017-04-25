var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  privilage: {
    type: String,
    default: "user",
    enum: ["admin", "user","superUser"]
  }
});

module.exports = mongoose.model("User", userSchema);
