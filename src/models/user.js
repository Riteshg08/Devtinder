 const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
       firstName:{
            type:String
       },
       lastName: {
            type: String
       },
       email:{
            type: String
       },
       age: {
            type: Number
       },
       gender:{
            type: String
       },
       password: {
             type: String
       }
 });

//Creating a model User using userSchema and it is used to interact with the users collection in the database
//The users collection is created automatically by the mongodb when we insert data into it for the first time
 module.exports = mongoose.model("User", userSchema);