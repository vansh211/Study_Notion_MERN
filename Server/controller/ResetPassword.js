const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')

// ReseetPassWord Toekn

exports.resetPasswordToken = async(req, res) => {
    try {
        //get email of acc
    const email = req.body.email;

    // id exits or not
    const user = await User.findOne({email : email})
    if(!user) {
        return res.json({
            success : false,
            message : "email is not registred"
        })
    }

    //generate token
    const token = crypto.randomUUID()
    //update user by adding token and expiry of reset
    const updateUser = await User.findOneAndUpdate({email : email}, {
        token : token,
        resetPAsswordExpires : Date.now() + 5 * 60 * 1000
    }, {new: true})
    // craete url
    const url = `https://localhost:3000/update-password/${token}`
    //send mail of the url
     await mailSender(email, "Password Chnage Link", `Password Reset Link : ${url}`)

    //return resposne
    return res.json({
        success : true,
        message:  "email sent succesffuly"
    })
}
catch(err) {
    return res.json({
        success : false,
        message : "error in reset passsword"
    })
}
}



// Reset Password

exports.resetPassword = async(req, res => {
    // data fetch 
    try{
        const {password, confirmPassword, token} = req.body;


        // validiate koor
        if(password !== confirmPassword) {
            return res.json({
                succes : false,
                message : "passwrond doest match"
            })
        }

        // get user details
        const userDeatils = await User.findOnee({token : token})

        //invalid token 
        if(!userDeatils) {
            return res.json({
                success  :false,
                message : "Token invalid"
            })
        }

        // time expire
        if(userDeatils.resetPAsswordExpires > Date.now()) {
            return res.json({
                success  :false,
                message : "Url expires now"
            })
        }

        // hash password
        const hashedPass = bcrypt.hash(password, 10);
        

        // update pass
        await User.findOneAndUpdate({token : token}, {password : hashedPass}, {new:true})

        // return rs
        return res.status(200).json({
            success : true,
            messge: "password changed successfukky"
        })
    }
    catch(err) {
        console.log("erro in reser" +  err);
        return res.status(400).json({
            success : true,
            mesage : "password not changes"
        })
    }
})