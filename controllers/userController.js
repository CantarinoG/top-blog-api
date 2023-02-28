const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createUser = (req, res, next) => {
    res.send("Creating new user.");
}

exports.logInUser = (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if(err) return res.status(500).json({error: "Could not access user in database."});
        if(!user) return res.status(404).json({error: "User not found."});
        bcrypt.compare(password, user.password, (err, hashed) => {
            if (err) return res.status(500).json({error: "Could not compare passwords."});
            if (hashed) {
                jwt.sign({user: {_id : user._id, username: user.username}}, process.env.JWT_KEY, (err, token) => {
                    res.json({token});
                })
            } else {
                return res.status(401).json({error: "Invalid password."});
            }
        })
    })
}
