const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    uri: { type: String}, 
    artist_name: { type: Array},
    artist_uri: {type: Array}
    }
);

module.exports = mongoose.model('User', userSchema);