// Create web server
// -----------------

// Import Express
const express = require('express');
// Import Express router
const router = express.Router();
// Import Mongoose
const mongoose = require('mongoose');

// Import Comment model
const Comment = require('../models/comment');

// Import Product model
const Product = require('../models/product');

// Import auth check
const checkAuth = require('../middleware/check-auth');

// GET all comments
router.get('/', (req, res, next) => {
    Comment.find()
        .select('product _id text')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                comments: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        text: doc.text,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/comments/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

// POST new comment
router.post('/', checkAuth, (req, res, next) => {
    // Check if product exists
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            // Create new comment
            const comment = new Comment({
                _id: mongoose.Types.ObjectId(),
                text: req.body.text,
                product: req.body.productId
            });
            // Save new comment
            return comment.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Comment created',
                createdComment: {
                    _id: result._id,
                    product: result.product,
                    text: result.text
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/comments/' + result._id
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

// GET comment by ID
router.get('/:commentId', (req, res, next) => {
    Comment.findById(req.params.commentId)
        .populate('product