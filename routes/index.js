var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const verifyToken = require("../helper/verifyToken");

router.get('/posts', postController.getPosts);

router.get('/posts/:id', postController.getSpecificPost);

router.post("/posts/:id/comments/create", verifyToken, postController.createComment);

router.post("/users/create", userController.createUser);

router.post("/users/login", userController.logInUser);

module.exports = router;
