const Section = require('../models/Section') 
const Course = require('../models/Course')


exports.createSection = async(req, res) => {
    try {
        // fetch data
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success : false,
                messsage : 'Missing fields required'
            })
        }
        //create section
        const newSection = await Section.create({sectionName})

        //update course with section id
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push:{courseContent : newSection._id}
        }, {new:true}).populate("") // add value in populae which show both section and subsection tghetr

    return res.status(200).json({
        success : true,
        messsage : "section created successfully"
    })
}
    catch(err) {
        return res.status(500).json({
            success : false,
            messsage : "error in create course",
            err
        })
    }
}

exports.updateSection = async(req, res) => {
    try {
        // fetch data
        const {sectionName, sectionId} = req.body;
         
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success : false,
                messsage : 'Missing fields required'
            })
        }

        // update data

        const section = await Section.findByIdAndUpdate({sectionId}, {sectionName}, {new : true})


        return res.sstaus(200).json({
            success:true,
            messgae: "section updated successfully"
        })
    }
    catch(err) {
        return res.status(500).json({
            success : false,
            messsage : "error in create course",
            err
        })
    }
}


exports.deleteSection = async(req, res) => {
    try {
        // fetch data
        const {sectionId} = req.params

        // delete
        await Section.findByIdAndDelete(sectionId)

        // Do we need to delete the section id from course Schema

        return res.status(200).json({
            success:true,
            messgae:"Section deleted success"
        })
        
    }
    catch(err) {
        return res.status(500).json({
            success : false,
            messsage : "error in create course",
            err
        })
    }
}
