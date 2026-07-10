const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Database connection takes some time because it connects over the internet.
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;

