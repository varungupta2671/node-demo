
"use strict";
const nodemailer = require("nodemailer");

var sendMail = async (randomPassword,email) => {

//let testAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "92princesingla@gmail.com", 
      pass: "malout@123456"
    }
  });

 var mailOptions = {
  from: '92princesingla@gmail.com',
  to: email,
  subject: 'Forgot Password',
  text: "Your New Password Is : " + randomPassword
};

transporter.sendMail(mailOptions, function (err, result) {
        console.log("email sent", err,result);
        
    });

}

module.exports = {
    sendMail : sendMail
};