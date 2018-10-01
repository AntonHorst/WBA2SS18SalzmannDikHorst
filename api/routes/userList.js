const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserList = require("../models/userList");

router.get('/', (req, res, next) => {
    UserList.find()
    .select('uri')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            Userlist: docs.map(doc => {
                return {
                    uri: doc.uri,
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


router.post('/', (req, res, next) => {
    const userList = new UserList({
        _id: new mongoose.Types.ObjectId(),
        uri: req.body.uri
    });
    userList.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created uri successfully',
                //createdProduct: result
                createdProduct: {
                    uri: result.uri,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/user/' + result.uri
                    }
                }
            });
        })
        .catch(err => { 
            console.log(err)
            res.status(500).json({
                error: err
            });
        }); 
    
});

router.delete('/:userURI', (req, res, next) =>{
    const uri = req.params.userURI;
    UserList.remove({uri: uri })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/user/' + uri,
                data: { uri: 'String' }
            }
        });
    })
    .catch(err =>{
        console.og(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;