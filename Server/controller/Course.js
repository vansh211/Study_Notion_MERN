const Course = require('../models/Course')
const User = require('../models/User')
const Tag = require('../models/Tag')
const {uploadImageToCloudinary} = require('../utils/imageUploader')


//create course handler
exports.createCourse = async(req, res) => {
    try {
        //fetch data and file
        const {courseName, courseDescription, whatWillYouLearn, price, tag} = req.body;
        const thumbnail = req.files.thumbnailImage;

        // validiate 
        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success : false,
                message : "All fields required"
            })
        }
        
        // who is Instuctor
        const userId = req.user.id
        const instructorDetails = await User.findOne(userId);
        console.log("intstuctor ", instructorDetails)
        
        if(!instructorDetails) {
            return res.status(400).json({
                success : false,
                message : "No instructor Found"
            })
        }
        
        //check tag is valid or not
        const tagDetails = Tag.findById(tag);
        if(!tagDetails) {
            return res.status(400).json({
                success : false,
                message : "No tag Found"
            })
        }

        //upload image
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // add in db course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatWillYouLearn,
            price,
            tag : tagDetails._id,
            thumbnail : thumbnailImage.secure_url
        })

        // add course entry in User schema which is user courses
        await User.findByIdAndUpdate({_id: instructorDetails._id}, {
            $push : {courses : newCourse._id}
        })        
        
        
        // add course entry in tag schema
        await Tag.findByIdAndUpdate({_id: tagDetails._id}, {
            $push : {courses : newCourse._id}
        })        
        

        return res.status(200).json({
            success : false,
            messgae : "COurse added success"
        })
    }
    catch(err) {
        return res.status(500).json({
            success : false,
            messgae : "Something failed"
        })
    }
}


// getAll Courses
exports.showAllCourses = async(req, res) => {
    try{
        const allCourses = await Course.find({}, {courseName: true, price:true, thumbnail:true, instructor:true, ratingAndReviews:true}).popilate("instructor").exec()
        return res.status(200).json({
            success : true,
            message : "Data fetched for all courses",
            data : allCourses
        })

    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            success : false,
            messgae : "Something failed"
        })
    }
}