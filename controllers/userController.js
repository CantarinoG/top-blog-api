const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createUser = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if(err) {

            const username = req.body.username;
            const password = req.body.password;
            const confirm = req.body.confirm;

            User.findOne({ username }).exec(function(err, user) {
                if(err) return res.status(500).json({ error: "Something went wrong. Could not check username availability", status: 500, userLoggedIn: false });

                const alerts = [];

                if(user != null) alerts.push("This username is already in use.");
                if(!username) alerts.push("Username is required.");
                if(!password || !confirm) alerts.push("Password is required.");
                if(password != confirm) alerts.push("Passwords do not match.");

                if(alerts.length) return res.status(400).json({ status: 400, alerts, userLoggedIn: false });

                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) return res.status(500).json({ status: 500, error: "Could not proccess password.", userLoggedIn: false });
                    const user = new User({
                        username,
                        password: hashedPassword
                    }).save(err => {
                        if (err) return res.status(500).json({ status: 500, error: "Could not save user.", userLoggedIn: false });
                        return res.status(200).json({ status: 200, userLoggedIn: true, success: "User created!"});
                    });
                })

            });

            }
        else {
            return res.status(403).json({error: "User is already logged in.", status: 403, userLoggedIn: true});
            }
    })
}

exports.logInUser = (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if(err) {
            const { username, password } = req.body;
            User.findOne({ username }, (err, user) => {
                if(err) return res.status(500).json({error: "Could not access user in database.", status: 500, userLoggedIn: false});
                if(!user) return res.status(400).json({alert: "User not found.", status: 400, userLoggedIn: false});
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) return res.status(500).json({error: "Could not compare passwords." , status: 500, userLoggedIn: false});
                    if (match) {
                        jwt.sign({user: {_id : user._id, username: user.username}}, process.env.JWT_KEY, (err, token) => {
                            if(err) return res.status(500).json({status: 500, error:"Could not create authentication token.", userLoggedIn: false});
                            return res.status(200).json({token, status: 200, userLoggedIn: true});
                        })
                    } else {
                        return res.status(400).json({alert: "Invalid password.", status: 400, userLoggedIn: false});
                    }
                })
            })
            }
        else {
            return res.status(403).json({error: "User is already logged in.", status: 403, userLoggedIn: true});
            }
    })
}
