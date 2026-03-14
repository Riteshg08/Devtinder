const express = require('express');

// create the express application object
// app is used to define routes, middleware(code that runs between the request and response), and server config
const app = express();

const {authAdmin,authUser} = require("./middlewares/auth.js");

//handling the auth using middelwears
app.use("/admin",authAdmin);

//for admin data we are using authAdmin middleware to check if the admin is authorized or not before sending the response
//if the admin is not authorized then it will send the response as unauthorized and if it is authorized then it will send the response as admin data
app.get("/admin/getData",(req,res) =>{
    res.send("This is the admin data");
});

app.delete("/admin/deleteData",(req,res) =>{
    res.send("The admin data is deleted");
});

//for user login there is no need of auth as it is the login page, so we are not using any middleware here
app.use("/user/login",(req,res)=>{
    res.send("This is the user login page");
});

//for user data we are using authUser middleware to check if the user is authorized or not
app.use("user/data",authUser,(req,res)=>{
    res.send("This is the user data");
});


//It is used to start the server and listen for incoming requests on a specific port
app.listen(7777, () => {
    console.log("Server is created successfully!");
});

