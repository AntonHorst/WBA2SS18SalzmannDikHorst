const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Taste = require("../models/taste");

router.get('/', (req, res, next) => {
    Taste.find()
    .select('name popularity _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            tastes: docs.map(doc => {
                return {
                    name: doc.name,
                    popularity: doc.popularity,
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

router.post('/', (req, res, next) => {
    const taste = new Taste({
        _id: new mongoose.Types.ObjectId(),
        name: body.name,
        popularity: body.popularity
    });
    taste
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created taste successfully',
                //createdProduct: result
                createdProduct: {
                    name: result.name,
                    price: result.popularity,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/taste/' + doc._id
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

router.get('/:tasteID', (req, res, next) =>{
    const id = req.params.tasteID;
    Product.findById(id)
        .select( 'name popularity _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_TASTES',
                        url: 'http://localhost:3000/taste/'
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

router.patch("/:tasteID", (req, res, next) =>{
    const id = req.params.tasteID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Taste updated',
            request: {
                type: 'GET',
                description: 'GET_TASTE',
                        url: 'http://localhost:3000/taste/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:tasteID', (req, res, next) =>{
    const id = req.params.tasteID;
    Taste.remove({_id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Taste deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/taste/',
                data: { name: 'String', popularity: 'Number' }
            }
        });
    })
    .catch(err =>{
        console.og(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;