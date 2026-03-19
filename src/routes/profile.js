const express = require("express");

const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");

profileRouter.get("/profile", authUser, async (req, res) => {
    //get the token from the cookie
    try {
        res.send(req.user);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

});

module.exports = {
    profileRouter
}