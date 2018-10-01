const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    uri: { type: String}, 
    artist_name: { type: Array},
    artist_uri: {type: Array}
    }
);

module.exports = mongoose.model('User', userSchema);