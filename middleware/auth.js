const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = function(req, res, next) {
    const token = req.header("x-auth-token");

    if(!token) {
        return res.status(401).json({error: "Auth-error", msg: "No token, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Auth-error", msg: "Token is invalid"});
    }
}