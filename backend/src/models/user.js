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
          //   trim: true
     },
     lastName: {
          type: String,
          minLength: 3,
          maxLength: 20
     },
     email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          //   validate(value){
          //      if(!value.includes("@gmail.com")){
          //           throw new Error("Email must be a valid Gmail address!");
          //      }
          //   }

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
          maxLength: 250
     }
}, { timestamps: true });

//here the function names are custom
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


//Creating a model User using userSchema and it is used to interact with the users collection in the database
//The users collection is created automatically by the mongodb when we insert data into it for the first time
module.exports = mongoose.model("User", userSchema);