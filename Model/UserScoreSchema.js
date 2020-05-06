const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Post
let UserScoreSchema = new Schema({
  id: {
    type: String
  },
  score: {
    type: Number
  },
},{
    collection: 'userScore'
});

module.exports = mongoose.model('userScoreSchema', UserScoreSchema);