//auth middleware
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login!!");
        }

        const decodedToken = await jwt.verify(token, "Devtinder@namastenode");

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new Error("User not found!!");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).send("Error: " + err.message);
    }
}

module.exports = {
    authUser,
};