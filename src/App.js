const express = require('express');

// create the express application object
// app is used to define routes, middleware(code that runs between the request and response), and server config
const app = express();

//request handlers are the functions that are executed when a route is matched
// app.use((req, res) => {
//     res.send("Hello World");
// });

//this will only handel get request to /user route
app.get("/user",(req,res) => {
    res.send({first:"Ritesh",last:"Gurkhe"});
});

app.post("/user",(req,res) => {
    //saving the data to the data base
    res.send("Data is saved successfully");
});

//Different express routing patterns

// After b we can add any character but end should be with c
// eg- abbbbc, abdfghhjgc

app.use("/ab*c", (req, res) => {
    res.send("Matched ab*c");
});

/*
+ => After b we can add any number of b
app.use("/ab+c", (req, res) => {
    res.send("Matched ab*c");
});
*/

/*
? => Here b is optional means if we do not write b then also it is fine
app.use("/ab?c", (req, res) => {
    res.send("Matched ab*c");
});
*/

// Routes Parameters
// Means for each route we can assign unique id
app.get("/user/:id", (req, res) => {
    res.send(req.params.id);
});

app.get("/user/:name", (req, res) => {
    res.send(req.params.name);
});

//Assigning multiple routes parameter to single route
app.get("/user/:id/post/:postId", (req, res) => {
    res.json(req.params);
    //it will give data in json format
});

//Regex route
// Here we can add bc multiple times
app.get(/a(bc)+d/, (req, res) => {
    res.send("Regex matched");
});


//Query Parameters - Query parameters are extra data sent in the URL after ?
//eg- /search?name=ritesh&id=48
// where name and id are the key's and ritesh and 48 is are there corresponding values
app.get("/search", (req, res) => {
    res.send(req.query);
}); 


//Multiple callback functions
//1
app.use("/game",(req,res,next) =>{
    console.log("Game route is called");
    // res.send("Welcome to the game 1");
    next();
},(req,res,next) =>{ 
    console.log("Game route is called again");
    res.send("Welcome to the game 2");
    next();
}); 

//app.use("/route",rH,rH2,[rH3,rH4],rh5);
//--------------------------------------------------------

//2
//here the 1st,2nd  and 3rd callback function is called as middleware and the 2nd callback function is called as request handler
app.use("/gamer",(req,res,next) =>{
    console.log("Gamer route is called");
    // res.send("Welcome to the gamer");
    next();
});
app.use("/gamer",(req,res,next) =>{
    console.log("Gamer route is called again");
    // res.send("Welcome to the gamer again");
    next();
});
app.use("/gamer",(req,res,next) =>{
    console.log("Gamer route is called again");
    // res.send("Welcome to the gamer again");
    next();
});
app.use("/gamer",(req,res) =>{
    console.log("Gamer route is called again");
    res.send("Welcome to the gamer again");
});


//It is used to start the server and listen for incoming requests on a specific port
app.listen(7777, () => {
    console.log("Server is created successfully!");
});

