const validator = require('validator');


const validateSignupData = (req) => {
    const { firstName, lastName, email, gender, password, skills } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required!!");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email must be a valid email address!");
    }
    else if (validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password!!");
    }
    else if (!["male", "female", "other"].includes(gender.toLowerCase())) {
        throw new Error("Invalid gender value!");

    }
    else if (skills.length > 10) {
        throw new Error("You can add max 10 skills!!");
    }

}

const validateProfileData = (req) => {
    try {
        const allowedEditFields = ["firstName", "lastName", "age", "about", "skills","photoUrl"];

        const isAllowedtoEdit = Object.keys(req.body).every(field => allowedEditFields.includes(field));

        if (!isAllowedtoEdit) {
            throw new Error("Invalid Edit request!!");
        }

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

module.exports = {
    validateSignupData,
    validateProfileData
}
