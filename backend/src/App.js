const express = require('express');
const http = require('http');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const { Server } = require("socket.io");

const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { authRouter } = require('./routes/auth');
const { userRouter } = require('./routes/user');
const { notificationRouter } = require("./routes/notification");
const { messageRouter } = require('./routes/message');
const Message = require("./models/message");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/',messageRouter);
app.use('/', notificationRouter);

// create a plain http server from our express app, so socket.io can attach to it
const server = http.createServer(app);

// attach socket.io to that same server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// this is the room name two users will share - always the same
// no matter who joins first, so both users land in the same room
const getRoomId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // frontend will call this when opening a chat window
    socket.on("joinChat", ({ userId, targetUserId }) => {
        const roomId = getRoomId(userId, targetUserId);
        socket.join(roomId);
        console.log(userId + " joined room " + roomId);
    });

    // frontend will call this when sending a message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
        try {
            const message = new Message({ senderId, receiverId, text });
            const savedMessage = await message.save();

            const roomId = getRoomId(senderId, receiverId);

            // send the new message to everyone in that room (both users)
            io.to(roomId).emit("messageReceived", savedMessage);
        } catch (err) {
            console.error("Error saving message:", err.message);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

connectDB()
    .then(() => {
        console.log("Database is connected successfully!");
        // use server.listen instead of app.listen, so both express AND socket.io work
        server.listen(7777, () => {
            console.log("Server is created successfully!");
        });
    })
    .catch((err) => {
        console.error("Error in connecting to database", err);
    });



