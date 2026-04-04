const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        trim : true
    },
    courses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }]
})
 
module.exports = new mongoose.model("Tag", TagSchema);


