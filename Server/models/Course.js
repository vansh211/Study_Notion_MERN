const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    CourseName : {
        type : String,
        trim : true
    },
    courseDescription : {
        type : String,
        trim : true
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        type : true,
        ref : "User"
    },
    whatYouWillLearn : {
        type : String,
    },
    courseContent : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Section"
    }],
    ratingAndReviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReviews"
    }],
    price : {
        type : Number
    },
    thumbNail : {
        type : String 
    },
    tag : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tags"
    },
    studentsEnrolled : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }

})
 
module.exports = new mongoose.model("Course", CourseSchema);


