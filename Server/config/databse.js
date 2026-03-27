const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = ()=> {
     try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected")
     }
     catch(err) {
        console.log("Error in Db", err);
        process.exit(1);
     }
}