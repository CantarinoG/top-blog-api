var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

router.get('/posts', postController.getPosts);

router.get('/posts/:id', postController.getSpecificPost);

router.post("/posts/:id/comments/create", postController.createComment);

router.post("/users/create", userController.createUser);

router.get("/users/login", userController.logInUser);

module.exports = router;
