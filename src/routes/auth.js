const express = require("express");

const authRouter = express.Router();

const { validateSignupData } = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {
    //creating a new instance of the user model
    //pushing a dynamic data given by the client in the request body to the user model

    try {
        const { firstName, lastName, email, age, gender, password, skills, about } = req.body;

        //Data validation
        validateSignupData(req);

        //password hashing
        //we can use bcrypt package for hashing the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        //instead of passing req.body this is the better way
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

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found!!");
        }

        //logic is writtenin the user model
        const isPasswordMatch = await user.comparePasswords(password);

        if (!isPasswordMatch) {
            throw new Error("Enter appropriate credentials!!");
        }
        else {
            //creating a JWT token
            //logic is written in the user model
            const token = await user.getJWT();

            // Add the token to cookie and send the response to the client
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true });
            res.send("User is logged successfully!!");
        }
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = {
    authRouter
}