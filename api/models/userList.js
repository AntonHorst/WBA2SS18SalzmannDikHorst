const mongoose = require('mongoose');

const userListSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uri: { type: String},
});

module.exports = mongoose.model('UserList', userListSchema);