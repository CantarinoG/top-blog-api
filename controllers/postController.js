const jwt = require('jsonwebtoken');

exports.getPosts = (req, res, next) => {
    res.send("Sending posts.");
}

exports.getSpecificPost = (req, res, next) => {
    res.send("Sending specific posts.");
}

exports.createComment = (req, res, next) => {
    jwt.verify(req.token, 'manonthemoon', (err, authData) => {
        if(err) return res.status(403).json({ error: "Authentication failed.", status: 403 });
        return res.status(200).json({ authData, status: 200 });
    });
}
