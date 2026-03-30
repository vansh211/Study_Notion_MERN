const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Profile = require("../models/Profile")
const jwt = require('jsonwebtoken')


// send otp
exports.sendOTP = async(req, res) => {
        try{
            const {email} = req.body;
            const checkUser = await User.findOne({email});

        if(checkUser) {
            return res.status(401).json({
                success : false,
                message : "User ALready Exists"
            })
        }

        // generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        });
        console.log("OTP generated", otp)
        
        // check unique otp
        const result = await OTP.findOne({otp : otp})
        
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false
            });  
            result = await OTP.findOne({otp : otp})
        }


        const OTPPayload = {email, otp};

        // crerate entry
        const otpbody = await OTP.create(OTPPayload)
        console.log(otpbody)

        res.status(200).json({
            success : true,
            message : "OTP sent success",
            otp
        })

    }

    catch(err) {
        console.log("error in otp generation" + err)

        return res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

// sign up

exports.singUp = async(req, res) => {
    // feth data
    try{
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

        // validiate 
        if(!firstName || !lastName || !email || !password ||!contactNumber || !otp) {
            return res.status(400).json({
                success : false,
                message : "all fields required"
            })
        }

        // match both password
        if(password !== confirmPassword) {
            return res.status(400).json({
                success : false,
                message : "PAsswords doesn't match"
            })
        }

        // check user already exist
            const checkUser = await User.findOne({email});

            if(checkUser) {
                return res.status(401).json({
                    success : false,
                    message : "User ALready Exists"
                })
            }

        //find most recent otp we can have multiple netry
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp)

        //validiate otp
        if(recentOtp.length == 0) {
            return res.status(400),json({
                success : false,
                message : "OTP is empty"
            })
        }
        
        else if(otp != recentOtp) {
            return res.status(400),json({
                success : false,
                message : "OTP not valid"
            })
        }


        // hashPassword
        const hashedPassword  = await bcrypt.hash(password, 10);

        // ecntery save in db
        const profileDeatils = await Profile.create({
            gender : null,
            dateOfBirth : null,
            about : null,
            contactNumber : null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails: profileDeatils._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })

        return res.status(200).json({
            success : true,
            message : "user is regerstred successfully"
        })
    }
    catch(err) {
        console.log("error in signup" + err)
        return res.status(500),json({
            success : false,
            message : "user not restred try again later"
        })
    }
}

//login
exports.login = async(req, res) => {
    try{
        // get data 
        const {email, password} = req.body

        // validiate
        if(!email || !password) {
            return res.status(400).json({
                success : false,
                message : "all filds required"
        })
    }

 
        // user exist or not
        const checkUser = await User.findOne({email}).populate("additionalDetails")
        if(!checkUser) {
            return res.status(401).json({
                success  :false,
                message: "user not found"
            })
        }

        //match password generate jwt token
        if(await bcrypt.compare(password, checkUser.password)) {
            const payload = {
                email : checkUser.email,
                id : checkUser._id,
                accountType : checkUser.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            checkUser.token = token;
            checkUser.password = undefined
    
            // create cookie ans respone send
    
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true
            }
            res.cookie("token", token, options).status(200).json({
                success : true,
                checkUser,
                token,
                message : "logged In successflly "
            })
        }
        else {
            return res.status(400).json({
                success : true,
                message : "Password not match"
            })
        }

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success  :false,
            message : "loggin failde try later"
        })
    }
}

// change Password
exports.changeCode = async(req, res) => {
        try {
        // get data from body
        // 3 inputs oldpass newpas confirmnewpass
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        // validiate
        if(newPassword != confirmNewPassword) {
            return res.status(400).json({
                success : false,
                message : "new password doen't match"
            })
        }

        const user = await User.findOne({email})
        const matchPass = bcrypt.compare(oldPassword, user.password);

        if(!matchPass) {
            return res.status(400).json({
                success : false,
                message : "password is wrong"
            })
        }

        // update pass in db
        // const updatePass = await User

        //send mail for update
    }

    catch(err) {

    }
}