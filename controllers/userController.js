exports.createUser = (req, res, next) => {
    res.send("Creating new user.");
}

exports.logInUser = (req, res, next) => {
    res.send("Authenticating user.");
}
