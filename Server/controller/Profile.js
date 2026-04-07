const Profile = require('../models/Profile')
const User = require('../models/User')

exports.updateProfile = async(req, res) => {
    try {
        //get data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        // get UserId
        const id = req.user.id;
        //validiate
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success : false,
                message : "All fieldds required"
            })
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId) 

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber
        profileDetails.about = about;
        profileDetails.gender = gender

        await profileDetails.save();
        // return res

        return res.status(200).json({
            success : true,
            message : "Profile updated successflly",
            profileDetails
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Profile updating error"
        })
    }
}



// Delete Account

exports.deleteAccount = async(res, req) => {
    try{
        // get id
        const id = req.user.id
        
        // vlidiate
        const userDetails = await User.findById(id)
        
        if(!userDetails) {
            return res.status(404).json({
                success : false,
                message : "user not found"
            })
        }
        
        // delete profile of user
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        
        
        // to do -> Uneroll user from all enrolled courses && learn to schedule req 
        
        // delete user
        await User.findByIdAndDelete({_id:id})
        
        
        // res retrun
        return res.status(200).json({
            success : true,
            message : "user deleted succcess"
        })
        
    }
    catch(err) {
        return res.status(400).json({
            success : false,
            message : "user deleting errors"
        })
    }
}


// get user details

exports.getAllUserDetails = async(req, res) => {
    try {
        // get id of user
        const id = req.user.id
        
        // validiate and get user details
        
        const userDeatils = await User.findById(id).populate("additionalDetails")
        return res.status(200).json({
            success : true,
            message : "user data fetched"
        })
    }
    catch(err) {
        return res.status(400).json({
            success : false,
            message : "user details errors"
        })
    }
}