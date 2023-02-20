
const Jwt = require('jsonwebtoken'),
        Config = require('../Config'),
        DAO = require('../DAOManager').queries,
        Models = require('../Models/'),
        UniversalFunctions = require('../Utils/UniversalFunctions'),
        _ = require('lodash')
       ERROR = Config.responseMessages.ERROR;

var FCM = require('fcm-push');
//let Imap = require('imap');
let inspect = require('util').inspect;
let fs = require('fs'), fileStream;
let nodemailer = require('nodemailer');
let sesTransport = require('nodemailer-ses-transport');




const get_email = async() =>{
    try{ 
    let query = { };
    let projection = { __v : 0};
    let options = {lean : true};
    let getMails = await DAO.getData(Models.emailCredentials,query,projection,options);

     if(getMails.length != 0){
     let transporter = nodemailer.createTransport(sesTransport({ 
       
        accessKeyId : getMails[0].accessKeyId ,  
        secretAccessKey : getMails[0].secretAccessKey, 
        region : getMails[0].region  
     }));

     
     return  {
       transporter : transporter,
       getMails : getMails
     } 
   }
   return [];
}catch(err){
    throw err;
  }
}



var sendMail = async(data) => {
   
    var get =await get_email();
    if(get){
    let data1 = get.getMails
    if(data1.length != 0){
    let obj ={
        from: data1[0].from,// "info@stackgeeks.com",   
        to: data.email,
        subject: data.subject, // Subject line
        html: data.content,
    };
 
    get.transporter.sendMail(obj,(err,res)=>{
        console.log('send mail',err,res);
    })
   }
    return null
}
}



var receiveMail = async(data) => {
   
    if(data1.length != 0){
    let obj ={
        from: data1[0].from,// "info@stackgeeks.com",   
        to: data.email,
        subject: data.subject, // Subject line
        html: data.content,
    };
 
    get.transporter.sendMail(obj,(err,res)=>{
        console.log('send mail',err,res);
    })
   }
    return null
}


var sendMails = async(data) => {

    var get =await get_email();
    let data1 = get.getMails
    if(data1.length != 0){

    
    let obj ={
        from: data1[0].from, //"info@stackgeeks.com"
        to: data.to,
        bcc: data.bcc,
        cc : data.cc,
        subject: data.subject,
        html: data.content,
    };

    get.transporter.sendMail(obj,(err,res)=>{
        console.log('send mail',err,res);
    })
    
    return null
}
}

var sendNotification = async (data,deviceToken) => {

    var fcm = new FCM(Config.APP_CONSTANTS.SERVER.NOTIFICATION_KEY);

    let message = {
        to : deviceToken,
        notification : {
            title : data.title,
            message : data.message,
            pushType : data.type,
            body : data.message,
            sound : "default",
            badge : 0,
        },
        data : data,
        priority : 'high'
    };

    console.log("--------------------push_data",message)

    fcm.send(message, function (err, result) {
        if(err) {
            console.log("----------------err",err)
        }
        else {
            console.log("----------------result",result)
        }
    });
};

module.exports={
    sendNotification : sendNotification,
    sendMail:sendMail,
    sendMails:sendMails,
    get_email:get_email,
    receiveMail : receiveMail,
};

