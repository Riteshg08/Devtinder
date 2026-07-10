const express = require("express");

const notificationRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const Notification = require("../models/notificationModel");

// Get all notifications for the logged in user, newest first
notificationRouter.get("/user/notifications", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const notifications = await Notification.find({ userId: loggedInUser._id })
            .populate("fromUserId", "firstName lastName photoUrl")
            .sort({ createdAt: -1 });

        res.json({
            message: "Notifications fetched successfully",
            data: notifications
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// Mark all notifications as read
notificationRouter.patch("/user/notifications/markAllRead", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        await Notification.updateMany(
            { userId: loggedInUser._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: "All notifications marked as read" });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = {
    notificationRouter
};