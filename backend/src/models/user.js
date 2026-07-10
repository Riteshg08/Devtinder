const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
     firstName: {
          type: String,
          minLength: 3,
          maxLength: 20,
          required: true,
     },
     lastName: {
          type: String,
          minLength: 3,
          maxLength: 20
     },
     username: {
          type: String,
          unique: true
     },
     email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          validate(value) {
               if (!validator.isEmail(value) || !validator.isLowercase(value)) {
                    throw new Error("Email must be a valid email address!");
               }
          }
     },
     age: {
          type: Number,
          min: 18,
          max: 120
     },
     gender: {
          type: String,
          validate(value) {
               if (!["male", "female", "other"].includes(value.toLowerCase())) {
                    throw new Error("Invalid gender value!");
               }
          }
     },
     photoUrl: {
          type: String,
          default: "https://ui-avatars.com/api/?name=User"
     },
     password: {
          type: String,
          required: true,
          validate(value) {
               if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a strong password!!");
               }
          }
     },
     skills: {
          type: [String]
     },
     about: {
          type: String,
          default: "I'am xyz. I am a software developer with 5 years of experience in web development. I have worked on various projects and have a strong background in JavaScript, Node.js, and MongoDB.",
          maxLength: 200
     },

     // ---- job info fields ----
     title: {
          type: String // e.g. "Frontend Developer"
     },
     company: {
          type: String // e.g. "Amazon"
     },
     location: {
          type: String
     },
     githubUsername: {
          type: String
     },
     portfolioUrl: {
          type: String
     },
     linkedinUrl: {
          type: String
     },
     experience: {
          type: Number
     }

}, { timestamps: true });

userSchema.methods.getJWT = async function () {
     const user = this;
     const token = await jwt.sign({ userId: user._id }, "Devtinder@namastenode", { expiresIn: "7d" });
     return token;
}

userSchema.methods.comparePasswords = async function (passwordInput) {
     const user = this;
     const isPasswordMatch = await bcrypt.compare(passwordInput, user.password);
     return isPasswordMatch;
}

module.exports = mongoose.model("User", userSchema);