const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        // who this notification belongs to (the person who should see it)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["request", "match", "profileView", "message"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    fromUserId: {
        // who triggered this notification (e.g. who sent the request)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);