const express = require("express");
const validator = require("validator");

const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validator");
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view", authUser, async (req, res) => {
    //get the token from the cookie
    try {
        res.send(req.user);
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }

});

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    try {
        validateProfileData(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// Forgot the password
profileRouter.patch("/profile/passwordUpdate", authUser, async (req, res) => {
    try {
        const user = req.user;

        const isNewPasswordisSameAsOld = await user.comparePasswords(req.body.password);

        if (isNewPasswordisSameAsOld) {
            throw new Error("New password cannot be same as old password!!");
        }

        const isPasswordisStrong = validator.isStrongPassword(req.body.password);
        if (!isPasswordisStrong) {
            throw new Error("Enter a strong password!!");
        }

        const passwordHash = await bcrypt.hash(req.body.password, 10);
        user.password = passwordHash;
        await user.save();
        res.send("Password updated successfully!!");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = {
    profileRouter
}