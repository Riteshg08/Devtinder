const express = require('express');
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

//we use async because saving data in the database is asynchronous operation and we need to wait for it to complete before sending the response to the client
app.post("/signup", async (req, res) => {
    //creating a new instance of the user model
    const user = new User({
        firstName: "MS",
        lastName: "Dhoni",
        email: "ms.dhoni@example.com",
        age: 44,
        gender: "Male",
        password: "dhoni123"
    });

    //saving the user to the database
    try {
        await user.save();
        res.send("User is Added successfully!");
    }
    catch (err) {
        res.status(400).send("Error:" + err.message);
    }
});


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




