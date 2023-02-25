#! /usr/bin/env node

const async = require('async')
const User = require('./models/user')
const Post = require("./models/post")
const Comment = require('./models/comment')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); 
const mongoDB = process.env.MONGODB_URI;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const users = [];
const posts = [];
const comments = [];

function userCreate(username, password, cb) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log(err);
            return;
        }   

        userDetail = {
            username: username,
            password: hashedPassword
        }

        const user = new User(userDetail);
        user.save(function(err) {
            if(err) {
                cb(err, null);
                return;
            }
            console.log("New user: ", user);
            users.push(user);
            cb(null, user);
        });

    });
}

function commentCreate(user, content, cb) {
    commentDetail = {
        user,
        content
    }
    const newComment = new Comment(commentDetail);
    newComment.save(function (err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New comment: ", newComment);
        comments.push(newComment);
        cb(null, newComment);
    });
}

function postCreate(title, content, comments, cb) {
    postDetail = {
        title,
        content,
        comments
    }
    const newPost = new Post(postDetail);
    newPost.save(function (err) {
        if(err) {
            cb(err, null);
            return;
        }
        console.log("New post: ", newPost);
        posts.push(newPost);
        cb(null, newPost);
    });
}

function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate("CantarinoG", "123456", callback);
        }
    ], cb);
}

function createComments(cb) {
    async.parallel([
        function(callback) {
          commentCreate(users[0], "One of the first comments!", callback);
        },
        function(callback) {
          commentCreate(users[0], "Heeey!", callback);
        },
        ],
        cb);
}

function createPosts(cb) {
    async.parallel([
        function(callback) {
          postCreate("First post!", "Welcome to the blog! :)", [comments[0], comments[1]], callback);
        }
    ], cb);
}

async.series([
    createUsers,
    createComments,
    createPosts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});
