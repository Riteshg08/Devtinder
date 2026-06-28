const express = require("express");

const requestRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user");


requestRouter.post("/request/send/:status/:userID", authUser, async (req, res, next) => {
    try {
        const toUserId = req.params.userID;
        const status = req.params.status;
        const fromUserId = req.user._id;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status type");
        }

        //check wheather the connection request exist or not
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

        //creating new instance of a model
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

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

        // const connectionRequest = await connectionRequestModel.findOne({
        //     _id: requestId,
        //     toUserId: loggedInUser._id,
        //     status: "interested"
        // });

        // if (!connectionRequest) {
        //     throw new Error("Connection request does not exist!");
        // }

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