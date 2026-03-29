const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expries : 5 * 60
    }
})

async function sendVerification(email, otp) {
    try {
        const mailResponse = await mailSender(email, "OTP Verification by WaRRioR", otp);
        console.log("email sent succeffuly" + mailResponse)
    }
    catch(err) {
        console.log("error in mailSender" + err);
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerification(this.email, this.otp)
    next()
})
 
module.exports = new mongoose.model("OTP", OTPSchema);


