const mongoose = require('mongoose');
const { resetPasswordToken } = require('../controller/ResetPassword');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        require : true
    },
    accType : {
        type : String,
        enum : ["student", "admin", "instructor"],
        required : true
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile"
    },
    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }],
    image : {
        type : String,
        required: true
    },
    token : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    },
    courseProgress : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseProgress"
    }]
})
 
module.exports = new mongoose.model("User", userSchema);


