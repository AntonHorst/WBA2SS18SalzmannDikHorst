const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var User = require("../models/user");

const userRoutes = require('./user');
const tasteScore = require("../models/tasteScore");

var user1 = new User({
    _id: '',
    name: '',
    uri: '',
    artist_name: [20],
    artist_uri: [20]
    }
);
var user2 = new User({
    _id: new mongoose.Types.ObjectId(),
    name: '',
    uri: '',
    artist_name: [20],
    artist_uri: [20]
    }
);

function getTasteScores (user1uri){
    const uri1 = user1uri;
    User.find({uri: uri1 })
    .select('uri name _id artist_name artist_uri')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json();
        } else {
            res.status(404).json({message: 'No valid entry found with this ID.'});
        }           
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });
    user1.save()

    var datauser1 = JSON.parse(user1);
    console.log(datauser1);


} 



module.exports = getTasteScores;