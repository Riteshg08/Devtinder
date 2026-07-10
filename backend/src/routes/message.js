const express = require("express");

const messageRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const Message = require("../models/message");

// Get all messages between the logged in user and a specific target user
messageRouter.get("/messages/:targetUserId", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const targetUserId = req.params.targetUserId;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser._id, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: loggedInUser._id }
            ]
        }).sort({ createdAt: 1 });

        res.json({
            message: "Messages fetched successfully",
            data: messages
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = {
    messageRouter
};