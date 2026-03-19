const express = require("express");

const requestRouter = express.Router();
const { authUser } = require("../middlewares/auth");



requestRouter.post("/sendconnectionrequest", authUser, async (req, res) => {
    try {
        res.send("Connection request sent successfully!!");
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = {
    requestRouter
}