const Tag = require('../models/Tag')


//create tag

exports.createTag = async(req, res) => {
    try {
        const {name, description} = req.body

        // validation
        if(!name || !description) {
            return res.json({
                success : false,
                message : "All field required"
            })
        }

        // create enrty
        const tagDetails = await Tag.create({
            name : name,
            description : description
        })
        console.log(tagDetails)

        res.status(200).json({
            success:true,
            message : "Tag created success"
        })
    }
    catch(err) {
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

exports.showAllTags = async(req, res) => {
    try {
        const alltags = await Tag.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            messgae: "all tags fetched succss"
        })
    }
    catch(err) {
        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
} 