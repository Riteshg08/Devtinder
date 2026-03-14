const express = require('express');

// create the express application object
// app is used to define routes, middleware(code that runs between the request and response), and server config
const app = express();

//This route handler handle the error in the route and send the response to the client
app.get("/getData", (req, res) => {
    try {
        throw new Error("Something went wrong!!!");
        res.send("Data is fetched successfully");
    }
    catch (err) {
        res.status(500).send("Error:Please contact to administrator");;
    }
});


//Error is not handle in the route so it will reach to the error handling middleware and send the response to the client
app.get("/getData/123", (req, res) => {

    throw new Error("Something went wrong!!!");
    res.send("Data is fetched successfully");
});


//error handling middleware means it will catch the error thrown in the above route and send the response to the client
// if the error is handle in the route then it will not reach to the error handling middleware and send the response to the client
app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong");
    }
});


// A way to handle the error in the route and send the response to the client using next() function
app.get("/getUser",(req,res,next)=>{
    const err = new Error("Something went wrong");
    next(err);
});

app.use((err,req,res,next)=>{
    res.status(500).send("Something went wrong!!");
});


//It is used to start the server and listen for incoming requests on a specific port
app.listen(7777, () => {
    console.log("Server is created successfully!");
});

