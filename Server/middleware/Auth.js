const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require('../models/User')

// auth
exports.auth = async(req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token) {
            return res.status(400).json({
                success : false,
                message : "Token is missing"
            })
        }

        //verigy the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user = decode;
        }
     catch(err) {
        return res.status(400).json({
            success : false,
            message : "error in token decode / invalid"
        })
    }
    next();
}
catch(err) {
   return res.status(400).json({
       success : false,
       message : "error in token fetch"
   })
}
}



// isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(400).json({
                success : false,
                message : "You're not Student"
            })
        }
    next();
}
catch(err) {
   return res.status(400).json({
       success : false,
       message : "error in student role"
   })
}
}



// isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return res.status(400).json({
                success : false,
                message : "You're not Insturctor"
            })
        }
    next();
}
catch(err) {
   return res.status(400).json({
       success : false,
       message : "error in insturctor role"
   })
}
}


// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(400).json({
                success : false,
                message : "You're not admin"
            })
        }
    next();
}
catch(err) {
   return res.status(400).json({
       success : false,
       message : "error in admin role"
   })
}
}