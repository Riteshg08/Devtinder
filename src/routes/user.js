const express = require("express");

const userRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest.js")
const User = require("../models/user.js")

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age skills about photoUrl");

        res.json({
            message: "Data is fetched successfully",
            data: connectionRequest
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

});

//Showing all connection 
userRouter.get("/user/connection", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName age skills about photoUrl").populate("toUserId", "firstName lastName age skills about photoUrl");

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
});

userRouter.get("/feed", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skipPages = (page - 1) * limit;

        //In the feed we will see all the profiles except
        /* 1. Yourself
           2. User who have send request to you or the user whome you have sent request [pending stage or ignored]
           3. Connections
        */

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            if (req.fromUserId.toString() !== loggedInUser._id.toString()) {
                hideUsersFromFeed.add(req.fromUserId.toString());
            }
            if (req.toUserId.toString() !== loggedInUser._id.toString()) {
                hideUsersFromFeed.add(req.toUserId.toString());
            }
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select("firstName lastName age skills about photoUrl")
            .skip(skipPages)
            .limit(limit);

        res.json({ users });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = {
    userRouter
};