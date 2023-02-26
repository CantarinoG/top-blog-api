var express = require('express');
var router = express.Router();

router.get('/posts', function (req, res, next) {
    res.send("Sending posts.");
});

router.get('/posts/:id', function (req, res, next) {
    res.send("Sending details about an specific post.");
});

router.post("posts/:id/comments/create", function (req, res, next) {
    res.send("Creating new post.");
});

router.post("users/create", function (req, res, next) {
    res.send("Creating new user.");
});

router.get("users/login", function (req, res, next) {
    res.send("Authenticating user.");
});

module.exports = router;
