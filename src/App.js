const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');

const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { authRouter } = require('./routes/auth');


app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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




