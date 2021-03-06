const mongoose = require('mongoose');

const tasteScoreSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    useruri1: { type: String},
    useruri2: { type: String},
    score   : {type: Number},
    artists_name :{type: Array},
    artists_uri:{type:Array}
});

module.exports = mongoose.model('tasteScore', tasteScoreSchema);