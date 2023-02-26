exports.getPosts = (req, res, next) => {
    res.send("Sending posts.");
}

exports.getSpecificPost = (req, res, next) => {
    res.send("Sending specific posts.");
}

exports.createComment = (req, res, next) => {
    res.send("Creating new comment.");
}
