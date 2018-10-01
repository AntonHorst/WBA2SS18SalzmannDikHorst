const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/*var User = require("../models/user");

const userRoutes = require('./user');*/
const tasteScore = require("../models/tasteScore");

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

router.get('/:tastescoreID', (req, res, next) =>{
    const id = req.params.tastescoreID;
    tasteScore.findById(id)
        .select( 'useruri1 useruri2 score artists_name artists_uri _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    user1: doc.useruri1,
                    user2: doc.useruri2,
                    score: doc.score,
                    artist_name: doc.artists_name,
                    artist_uri: doc.artists_uri,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_TASTES',
                        url: 'http://localhost:3000/tastescores/'
                    }
                });
            } else {
                res.status(404).json({message: 'No valid entry found with this ID.'});
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        });
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

router.delete('/:tastescoreID', (req, res, next) =>{
    const id = req.params.tastescoreID;
    tasteScore.remove({_id: id})
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