var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var menuSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    upvote: {
        type: Number,
        default: 0
    },
    downvote: {
        type: Number,
        default: 0
    },
    comments: [String]
    ,
     username: {
    type: String,
    required: true
  }
    
});



module.exports = mongoose.model("Community", menuSchema);