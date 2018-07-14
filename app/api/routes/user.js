const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require("../models/user");


router.get('/', (req, res, next) => {
    User.find()
    .select('name uri _id artists artist_name artist_uri')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            peterlustig: docs.map(doc => {
                return {
                    name: doc.name,
                    uri: doc.uri,
                    _id: doc._id,
                    artist_name: doc.artist_name,
                    artist_uri: doc.artist_uri,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/' + doc._id
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

router.get('/:uri', (req, res, next) => {
    User.find()
    .select('name uri _id artists')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            tastes: docs.map(doc => {
                return {
                    name: doc.name,
                    uri: doc.uri,
                    _id: doc._id,
                    artist_name: doc.artist_name,
                    artist_uri: doc.artist_uri,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/' + doc.uri
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

router.delete('/:userURI', (req, res, next) =>{
    const uri = req.params.userURI;
    User.remove({uri: uri })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/user/' + uri,
                data: { name: 'String', uri: 'String' }
            }
        });
    })
    .catch(err =>{
        console.og(err);
        res.status(500).json({error: err});
    });
});





module.exports = router;