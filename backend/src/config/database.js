const mongoose = require("mongoose");

//database connection takes time 
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://riteshg:BrEwsQJHT0YcJ4t7@nodejscluster.1blveyr.mongodb.net/devtinder"
    )
};
//here the devtinder is the name of the database which we want to connect to, if it is not present in the cluster then it will be created automatically when we insert data into it

module.exports = connectDB;

