const jwt = require('jsonwebtoken');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const async = require('async');
const { response } = require('express');
require('dotenv').config();

exports.getPosts = (req, res, next) => {
    Post.find({})
    .sort({ timestamp: -1})
    .exec(
        function (err, posts) {
            if(err) return res.status(400).json({ error: "Could not find posts, something wrong with the request.", status: 400 });
            return res.set({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            }).status(200).json({ status: 200, posts: posts });
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
        if(err) return res.status(403).json({ error: "Authentication failed.", status: 403, userLoggedIn: false});
        const user = authData.user._id;
        const post = req.params.id;

        Post.findById(post).exec(function(err, result) {

            if(err) return res.status(400).json({ status: 400, userLoggedIn: true, error: "Something went wrong. This post is not supposed to exist."});

            let content = null;
            if(req.body.content) {
                content = req.body.content.trim();
            }
        
            const alerts = [];

            if(!content) {
                alerts.push("Content is required.");
            }
            if(alerts.length) {
                return res.status(400).json({ status: 400, userLoggedIn: true, alerts });
            } 
            const comment = new Comment({
                user,
                content,
                post
            }).save(err => {
                if(err) res.status(500).json({ status: 500, userLoggedIn: true, error: "Something went wrong. Comment was not uploaded." });
                return res.status(200).json({ status: 200, userLoggedIn: true, success: "Comment created!"});
            })

        });
    });
}
