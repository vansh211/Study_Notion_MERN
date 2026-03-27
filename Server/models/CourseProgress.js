const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
    courseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    },
    completedVideos : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subsection"
    }
})
 
module.exports = new mongoose.model("CourseProgress", CourseProgressSchema);


