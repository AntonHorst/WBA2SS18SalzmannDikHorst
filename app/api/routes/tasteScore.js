const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/*var User = require("../models/user");

const userRoutes = require('./user');*/
const tasteScore = require("../models/tasteScore");
/*
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
);*/
/*
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


} */

//const Taste = require("../models/taste");

router.get('/', (req, res, next) => {
    tasteScore.find()
    .select('useruri1 useruri2 score _id artists_name artists_uri')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            tastes: docs.map(doc => {
                return {
                    user1: doc.useruri1,
                    user2: doc.useruri2,
                    score: doc.score,
                    artist_name: doc.artists_name,
                    artist_uri: doc.artists_uri,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/taste/' + doc._id
                    }
                }
            })
        };
        if (docs.length >= 0) {
        res.status(200).json(response);
        } else {
            //not really 404, just no objects in database
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
    
});

router.delete('/all', (req, res, next) =>{
    tasteScore.remove({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'TasteScores deleted',
        });
    })
    .catch(err =>{
        console.og(err);
        res.status(500).json({error: err});
    });
    
});

module.exports = router;