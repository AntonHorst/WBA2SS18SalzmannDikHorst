const mongoose = require('mongoose');

const tasteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    popularity: { type: Number}
});

module.exports = mongoose.model('Taste', tasteSchema);