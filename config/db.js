const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(">> [SYSTEM]: MONGODB ATLAS CONNECTED.");
        console.log(">> [STATUS]: MEMORY CORE ACTIVE.");
    } catch (err) {
        console.error(">> [FATAL]: CONNECTION FAILED.", err);
        process.exit(1); // If memory fails, the organism dies.
    }
};

module.exports = connectDB;