const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Post
let UserInfoSchema = new Schema({
  id: {
    type: String
  },
  password: {
    type: String
  },
},{
    collection: 'userInfo'
});

module.exports = mongoose.model('userSchema', UserInfoSchema);