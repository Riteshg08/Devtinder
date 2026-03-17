const express = require('express');
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");
const bcrypt = require('bcrypt');

const { validateSignupData } = require("./utils/validator");

//middleware to parse the incoming request body as JSON
//express.json() converts JSON request into js object so we can access it
app.use(express.json());

//we use async because saving data in the database is asynchronous operation and we need to wait for it to complete before sending the response to the client
app.post("/signup", async (req, res) => {
    //creating a new instance of the user model
    //pushing a dynamic data given by the client in the request body to the user model

    try {
            const { firstName, lastName, email,age, gender, password, skills, about } = req.body;

        //Data validation
        validateSignupData(req);

        //password hashing
        //we can use bcrypt package for hashing the password
        const passwordHash = await bcrypt.hash(password, 10);   
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            email,
            age,
            gender,
            password: passwordHash,
            skills,
            about
        });

        //data sanitization
        user.firstName = user.firstName.trim();
        user.lastName = user.lastName.trim();
        user.email = user.email.trim().toLowerCase();

        //saving the user to the database

        await user.save();
        res.send("User is Added successfully!");
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

//Get the users(multiple user can have same email(we have not set the rules yet so it is possible)) with the given email from the database
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {

        const users = await User.find({ email: userEmail });
        //here users is the array of user objects that match the given email, if there are no users with the given email then it will be an empty array
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong!!");
    }
});

//It is used to replace the exisiting docs with new doc and return the old doc by default
//We can change it by passing the third parameter as {new:true} to return the new doc instead of old doc
app.get("/userreplace", async (req, res) => {
    try {
        const users = await User.findOneAndReplace({ firstName: "Sunita" }, {
            firstName: "Shreya",
            lastName: "Ghoshal",
            email: "shreya.ghoshal@example.com",
            age: 45,
            gender: "Female",
            password: "shreya123"
        }, { returnDocument: "after" });

        if (!users) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong!!");
    }
});

//Get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    }
    catch (err) {
        res.status(500).send("Error:" + err.message);
    }
});

//Deleting the existing user from the database with the given user id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        //const user = await User.findByIdAndDelete({_id:userId});
        //Below is the shorthand of the above line of code
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.send("User is deleted successfully!");
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong!!");
    }
});

//Update the existing user in the database with the given user id and new data
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        //API VALIDATION
        //we want to allow only certain fields to be updated and we want to validate the updates before updating the user in the database
        const allowedUpdates = ["gender", "age", "about", "skills"];
        const canUpdate = Object.keys(data).every((key) => allowedUpdates.includes(key));
        if (!canUpdate) {
            res.status(400).send("Invalid updates!!");
        }

        if (data.skills.length > 10) {
            res.status(400).send("You can add maximum 10 skills!!");
        }


        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
        if (!user) {
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("Error:" + err.message);
    }
});

//--it can handle all email,id,gender etc
// app.patch("/user",async(req,res) =>{
//     const userEmail = req.body.email;
//     const data = req.body;
//     try{
//         const user = await User.findOneAndUpdate({ email: userEmail }, data, { returnDocument: "after" });
//         if(!user){
//             res.status(404).send("User not found");
//         }
//         else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("Something went wrong!!");
//     }
// });


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




