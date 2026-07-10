const express = require("express");

const requestRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user");
const Notification = require("../models/notificationModel");


requestRouter.post("/request/send/:status/:userID", authUser, async (req, res, next) => {
    try {
        const toUserId = req.params.userID;
        const status = req.params.status;
        const fromUserId = req.user._id;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type");
        }

        const isAlreadyRequested = await connectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (isAlreadyRequested) {
            throw new Error("Connection Request already exist");
        }

        const isUserExist = await User.findById(toUserId);
        if (!isUserExist) {
            throw new Error("User does not exist");
        }

        if (fromUserId.equals(toUserId)) {
            throw new Error("Cannot send connection request to self!");
        }

        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        // Create a notification for the receiver, only when it's an "interested" request
        if (status === "interested") {
            await new Notification({
                userId: toUserId,
                type: "request",
                message: req.user.firstName + " " + req.user.lastName + " sent you a connection request",
                fromUserId: fromUserId
            }).save();
        }

        res.json({ message: req.user.firstName + " is " + status, data });

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestID", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestID;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type");
        }

        const connectionRequest = await connectionRequestModel.findById(requestId);

        if (!connectionRequest) {
            throw new Error("Request not found");
        }

        if (!connectionRequest.toUserId.equals(loggedInUser._id)) {
            throw new Error("Not authorized");
        }

        if (connectionRequest.status !== "interested") {
            throw new Error("Request already reviewed");
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        // Create a notification for the original sender, only when accepted (a "match")
        if (status === "accepted") {
            await new Notification({
                userId: connectionRequest.fromUserId,
                type: "match",
                message: loggedInUser.firstName + " " + loggedInUser.lastName + " matched with you! Start chatting",
                fromUserId: loggedInUser._id
            }).save();
        }

        res.json({
            message: "Connection requested is " + status,
            data
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

});


module.exports = {
    requestRouter
}