
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is  invalid status type`,
        },
    }
},
    { timestamps: true });


// iF we do connectionRequest.find({fromUserId: 863597834}) it will be fast
//But if also add toUserId it will become slow becoz we have add index to fromUserId only 
// connectionRequestSchema.index({ fromUserId: 1 });

//TO solve ablove problem we will use compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// connectionRequestSchema.pre("save", function (next) {
//     const connectionRequest = this;
//     //check if the fromUserId is same as toUserId
//     // fromUserId and toUserId are usually ObjectId types so therefore we cant do fromUserID === toUserId
//     // it we do this it will check wheather they are pointing to same object or not
//     if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//         throw new Error("Cannot send connection request to self!");
//     }
//     next();
// });


module.exports = mongoose.model("connectionRequest", connectionRequestSchema); 