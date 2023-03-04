function verifyToken(req, res, next) {
    if(req.headers['authorization']){
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } 
    } else {
        req.token = "";
        next();
    }
}

module.exports = verifyToken;