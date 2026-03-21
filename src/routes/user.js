const express = require("express");

const userRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest.js")

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age skills about");

        res.json({
            message: "Data is fetched successfully",
            data: connectionRequest
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

userRouter.get("/user/connection", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUser: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId","firstName lastName age skills about").populate("toUserId","firstName lastName age skills about");

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "My connections!",
            data
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = {
    userRouter
};