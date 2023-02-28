const jwt = require('jsonwebtoken');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const async = require('async');
const { response } = require('express');
require('dotenv').config();

exports.getPosts = (req, res, next) => {
    Post.find({}, '-_id')
    .sort({ timestamp: -1})
    .exec(
        function (err, posts) {
            if(err) return res.status(400).json({ error: "Could not find posts, something wrong with the request.", status: 400 });
            return res.status(200).json({ status: 200, posts });
        }
    );
}

exports.getSpecificPost = (req, res, next) => {
    async.parallel({
        comments(callback) {
            Comment.find({ post: req.params.id}, '-_id -post')
            .sort({ timestamp: -1 })
            .populate('user', '-_id username')
            .exec(callback);
        },
        post(callback) {
            Post.find({_id: req.params.id}, '-_id').exec(callback);
        }
    }, (err, results) => {
        if(err) return res.status(400).json({ error: "Could not find posts, something wrong with the request.", status: 400 });
        return res.status(200).json({ status: 200, post: results.post[0], comments: results.comments });
    });
}

exports.createComment = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if(err) return res.status(403).json({ error: "Authentication failed.", status: 403 });
        return res.status(200).json({ authData, status: 200 });
    });
}
