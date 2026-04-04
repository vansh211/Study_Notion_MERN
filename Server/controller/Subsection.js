const Section = require('../models/Section') 
const Subsection = require('../models/Subsection')
const uploadVideoToCloudinary = require('../utils/imageUploader')


exports.createSubSection = async(req, res) => {
    try {
        // fetch data & file video
        const {sectionId, title, timeDuration, description} = req.body;
        const video = req.files.videoFile;

        // validita
        if(!sectionId || !title || !timeDuration || !description || !video) {   
            return res.status(400).json({
                success : false,
                messsage : "all fields are required"
            })
        }

        // upload video
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);

        // create subjsection

        const SubSectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl : uploadDetails.secure_url
        })

        //update section
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, {$push: {subSection : SubSectionDetails._id}}, {new:true})

        return res.status(200).json({
            success:true,
            message:"subsection ccreated successfully"
        })
}
    catch(err) {
        return res.status(500).json({
            success : false,
            message : "error in subsection",
            err
        })
    }
}
 // update and delete to be done