const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");

const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { authRouter } = require('./routes/auth');
const { userRouter } = require('./routes/user')

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//using the routers on the app
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


connectDB()
    .then(() => {
        console.log("Database is connected successfully!");
        app.listen(7777, () => {
            console.log("Server is created successfully!");
        });
    })
    .catch((err) => {
        console.error("Error in connecting to database", err);
    });




