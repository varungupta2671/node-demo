const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  aws3 = Config.awsS3Config.s3BucketCredentials,
  Models = require("../Models"),
  commonController = require("./commonController");
var fs = require("fs");
var md5 = require("md5");
const filterController = require("./filterController");
var moment = require("moment");
const { v4: uuidv4 } = require("uuid");
var randomstring = require("randomstring");
var randomNum = require("random-numbers-generators");
const { ToWords } = require("to-words");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const notificationController = require("./notificationController");
const feedAggreagtion = require("../Aggregation/listingHome");
// const QR = require("qrcode-base64") ;
const chatAggregation = require("../Aggregation/list_chat") ;

const aggregationExploreIndustry = require("../Aggregation/listingExploreData") ;
const rate_of_tone = 1.893 ;
const mongoose = require("mongoose");
var SendOtpManager = require("../Libs/sendOtpManager");

let url = "https://meet.jit.si/";
var OTP = 123456;

const AWS = require("aws-sdk");
// // const { model, Model, Model } = require("mongoose");
// const { error } = require("console");
// const Controller = require(".");
// const { default: arraySort } = require("array-sort");
// const { findAndUpdate } = require("../DAOManager/queries");

const stripe = require("stripe")(
  "sk_test_51JraWXJ5pphZmj9S4rZv58wlo4pwftdDnBim8cCHFiJCU0vsNwHQITDPYUSEwDw1Xi0nl5MJ8YUd6l3nUvZo9iCl00AFd3EJNO"
);

const toWords = new ToWords({
      localeCode: "en-US",
      converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
      },
});

const imageUpload = async (payloadData) => {
  try {
     

    // console.log("....payloadData..",payloadData)

    const s3 = new AWS.S3({
      bucket: aws3.bucket,
      accessKeyId: aws3.accessKeyId,
      secretAccessKey:aws3.secretAccessKey,
      folder: {
        profilePicture : "profilePicture",
        thumb : "thumb"
      }
    });

    let data1 = payloadData.image
    let ContentType = "image/png"   
    let date = moment().format('x') ;
    let name = "IMAGE" + randomstring.generate(7) + date.toString() +   ".png";
    if(payloadData.image ){
       data1 = payloadData.image
       name = "IMAGE" + randomstring.generate(7) + date.toString() +   ".png";;
    }
    if(payloadData.video){
       data1 = payloadData.video
       name = "VEDIO" + randomstring.generate(7)+ ".mp4";
       ContentType = "video/mp4"
    }
    if(payloadData.svg_file){
      data1 = payloadData.svg_file
      name = "SVG" + randomstring.generate(7)+ ".svg";
      ContentType = "image/svg+xml"
    };
    if(payloadData.pdf){ 
      data1 = payloadData.pdf
      name = "PDF" + randomstring.generate(7) + ".pdf";
      ContentType = "application/pdf" 
    }
    if(payloadData.file){
      data1 = payloadData.file
      name = "FILE" + randomstring.generate(7)+ ".pdf";
      // ContentType = "image/svg+xml"
    }
       
    let params = {
      Bucket: aws3.bucket, 
      Key : name,
      Body: data1,
      ContentType : ContentType

    };
     const data = await s3.upload(params).promise()
     const { Location } = data
     return Location
  
  } catch (err) {
    throw err;
  }
}

// const imageUpload = async (payloadData) => {
//       try {
//             const s3 = new AWS.S3({
//                   bucket: aws3.bucket,
//                   accessKeyId: aws3.accessKeyId,
//                   secretAccessKey: aws3.secretAccessKey
//             });
//             let data;
//             let name = "";
//             if (payloadData.image) {
//                   data = payloadData.image;
//                   name = "IMAGE" + randomstring.generate(7) + ".png";
//             };
//             if (payloadData.audio) {
//                   data = payloadData.audio;
//                   name = "AUDIO" + randomstring.generate(7) + ".mp3";
//             };
//             if (payloadData.pdf) {
//                   data = payloadData.pdf;
//                   name = "PDF" + randomstring.generate(7) + ".pdf";
//             };
//             if (payloadData.video) {
//                   data = payloadData.video;
//                   name = "VIDEO" + randomstring.generate(7) + ".mp4";
//             };
//             let params = {
//                   Bucket: aws3.bucket,
//                   Key: name,
//                   Body: data,
//                   c
//             };
//             console.log(params);
//             const data1 = await s3.upload(params).promise();
//             const { Location } = data1;
//             return Location;
//       } catch (err) {
//             throw err;
//       }
// };


const data_to_save = async (data) => {
      try {
            let data_to_save = {};

            if (data.full_name) {
                  data_to_save.full_name = data.full_name;
            };
            if (data.department_id) {
                  data_to_save.department_id = data.department_id;
            };
            if (data.contact_number) {
                  data_to_save.contact_number = data.contact_number;
            };

            if (data.email) {
            data_to_save.email = data.email.toLowerCase();
            }; 

            if (data.socialKey) {
                  data_to_save.socialKey = data.socialKey;
            }

            if (data.profile_picture) {
            data_to_save.profile_picture = data.profile_picture;
            }

            if (data.password) {
            data_to_save.password = md5(data.password);
            };
            let save_data = await DAO.saveData(Models.users, data_to_save);
            return save_data;
      } catch (err) {
            throw err;
      }
};


const return_data = async (data) => {
      try {
            return data ;
      } catch (err) {
            throw err;
      }
};

const sign_up = async(payloadData) => {
  try{
        let Model = Models.users ;
        
        /****** check if email already exist or not */
        if(payloadData.email){
              
              let emails =  payloadData.email.toLowerCase() ;

              let fetch_email_exists = await commonController.check_user_email_data(emails) ;
              if(fetch_email_exists.length != 0) {
                    throw ERROR.EMAIL_ALREADY_EXIST ;
              }
        };

        /****** check if contactNumber already exist or not */
        if(payloadData.contact_number){
              let fetch_ph_num_exists = await commonController.check_mobileNumber(payloadData.contact_number) ;

              if(fetch_ph_num_exists.length != 0) {
                    throw ERROR.MOBILE_ALREADY_EXIST ;
              };
        };

        /***** check if password & confim password mismatches or not *********/
        if( payloadData.password != payloadData.confirm_password ){
              throw ERROR.CONFIRM_PASSWORD_INVALID ;
        } ;

        let user_details = {
              full_name : payloadData.full_name,
              department_id : payloadData.department_id,
              iso2_code : payloadData.iso2_code,
              country_code : payloadData.country_code,
              contact_number : payloadData.contact_number,
              email : payloadData.email.toLowerCase() ,
              password : md5(payloadData.password) ,
        };

        let save_data = await DAO.saveData(Model,user_details) ;

        
        let token_info = {
              _id: save_data._id,
              collection: Models.users,
              scope: Config.APP_CONSTANTS.SCOPE.USER,
        };

        if (payloadData.deviceToken) {
        token_info.deviceToken = payloadData.deviceToken;
        }

        if (payloadData.deviceType) {
        token_info.deviceType = payloadData.deviceType;
        }

        //  ##### generating access token
        let token_data = await commonController.generate_token(token_info);
        return token_data ;
  }catch(err){
    throw err ;
  }
};

const list_departments = async(payloadData,userData) => {
      try{
            let Model = Models.departments ;
            let query = { is_deleted : false } ;
            let fetch_all_depts = await DAO.getData(Model,query,{ __v : 0 }, { lean : true }) ;
            return fetch_all_depts ;
      }catch(err){
            throw err ;
      }
};

const login = async(payloadData) => {
  try{
    let Model = Models.users ;
    let query = {  
      email : payloadData.email.toLowerCase().trim() ,
      // is_user : payloadData.is_user
    } ;
    let projection = { __v : 0} ;
    let options = {lean : true } ;
    let fetch_data = await DAO.getData(Model,query,projection,options) ;
    if(fetch_data.length == 0) {
      throw ERROR.EMAIL_NOT_FOUND ;
    }else{
      if(fetch_data[0].isBlocked == true) {
        throw ERROR.USER_BLOCKED ;
      }else if(fetch_data[0].isDeleted == true){
        throw ERROR.USER_DELETED ;
      }else if(fetch_data[0].password != md5(payloadData.password) ){
        throw ERROR.CONFIRM_PASSWORD_INVALID ;
      }else{
        let token_info = {
          _id: fetch_data[0]._id,
          collection: Models.users,
          scope: Config.APP_CONSTANTS.SCOPE.USER,
        };
        if (payloadData.deviceToken) {
          token_info.deviceToken = payloadData.deviceToken;
        };
        if (payloadData.deviceType) {
          token_info.deviceType = payloadData.deviceType;
        };
        let get_data = await commonController.generate_token(token_info);
        if(get_data.company_id != null || get_data.company_id != undefined){
          let get_compny_name = await DAO.getDataOne(Models.companies,{_id : get_data.company_id,is_deleted : false},{__v : 0},{lean : true}) ;
          get_data.company_name = get_compny_name.name ;
        };
        return get_data;
      };
    };
  }catch(err){
    throw err ;
  };
};

const otpVerified = async (payloadData,userData) => {
  try{
    let Model = Models.users;
    let query = {
      _id: userData._id,
      otp: payloadData.otp,
    };
    let getOtp = await DAO.getData(Model, query, { __v: 0 }, { lean: true });
    if (getOtp.length != 0) {
      let query = {
            _id: userData._id,
      };
      let updateOtp = await DAO.findAndUpdate( Model,  query,{ otpVerified: true }, { new: true });
      return updateOtp;
    }else{
      throw ERROR.OTP_NOT_MATCH;
    };
  } catch(err){
      throw err;
  };
};

const otpResend = async(userData)=>{
  try{
    let Model = Models.users;
    let query = {  _id : userData._id };
    let updateOtp = await DAO.findAndUpdate(Model,query ,{otp : 123456,otpVerified : true }, { new  : true } ) ;
    let get_data = await return_data(updateOtp) ;        
    return get_data  ;
  }catch(err){
    throw err ;
  };
};

const logout = async(userData) => {
  try {
    let Model = Models.users;
    let query = {
      _id: userData._id,
      isDeleted: false,
    };
    let update = {
      accessToken: null,
      deviceToken : null,
      isOnline : false
    };
    //  #####  making access token and device token null
    let logout = await DAO.findAndUpdate(Model, query, update, { new: true });
    return logout;
  } catch (err) {
    throw err;
  }
};

const accessTokenLogin = async (payloadData,userData) => {
  try{
    console.log("access token api is running") ;
    if (userData.isDeleted == true) {
      let update_token = await DAO.findAndUpdate(Models.users, { _id: userData._id }, { accessToken: null, deviceToken: null, isOnline : false }, { new: true }  );
      throw ERROR.USER_DELETED;
    };
    if (userData.isBlocked == true) {
      let update_token = await DAO.findAndUpdate(Models.users, { _id: userData._id }, { accessToken: null, deviceToken: null, isOnline : false},{ new: true } );    
      throw ERROR.USER_BLOCKED;
    };
    let return_data ;
    let array = [] ;
    let populate = [
      {
        path : "department_id",
        select : "_id name"
      }
    ]
    let show_data = await DAO.populate_Data(Models.users,{ _id: userData._id },{ __v: 0 },{ lean : true },populate) ;
    if(show_data.length != 0){
      for(let com of show_data ){
        if(com.company_id != null || com.company_id != undefined){
          let compny_name = await DAO.getDataOne(Models.companies,{_id : com.company_id,is_deleted : false},{__v : 0},{lean : true}) ;
          com.company_name = compny_name.name  ;
        }else{
          com.company_name = null ;
        }
      }
    }
    let fetch_company_details = await DAO.getData(Models.compny_address,{ user_id : userData._id,is_deleted : false },{__v : 0},{lean : true}) ;
    if(fetch_company_details.length != 0){
      return_data = await DAO.findAndUpdate(Models.users,{ _id: userData._id },{company_id : fetch_company_details[0].company_id,compny_address_id : fetch_company_details[0]._id},{new : true}) ;
      let populate_data = await DAO.populateSingleData(Models.users,{ _id : userData._id },{ __v : 0 },{ lean : true },populate);
      if(populate_data.company_id != null || populate_data.company_id != undefined){
        let compny_name = await DAO.getDataOne(Models.companies,{_id : populate_data.company_id,is_deleted : false},{__v : 0},{lean : true}) ;
        populate_data.company_name = compny_name.name  ;
      }else{
        populate_data.company_name  = null ;
      }
      array.push(populate_data) ;
      return array ;
    }else{
      return show_data ;
    };
  }catch(err){
    throw err ;
  };
};

const forgotPassword = async (payloadData, userData) => {
  try {
    let Model = Models.users;
    let query = {
      email: payloadData.email.toLowerCase(),
      isDeleted: false,
    };
    let projection = { _id: 1, email: 1 };
    let options = { lean: true };
    let fetch_details = await DAO.getData(Model, query, projection, options);
    if (fetch_details.length != 0) {
      return {
        message: "Link has been sent to your Email Address",
      };
    }else{
      throw ERROR.EMAIL_NOT_FOUND;
    };
  } catch (err) {
    throw err;
  }
};

const updatePassword = async (payloadData, userData) => {
  try {
    let Model = Models.users;
    if (payloadData.newPassword != payloadData.confirmPassword) {
      throw ERROR.CONFIRM_PASSWORD_MISMATCH;
    }else{
      //  if new password & confirm password matches
      let query = {
        _id: userData._id,
        password: md5(payloadData.currentPassword),
      };
      let check_password = await DAO.getDataOne(Model,query, { __v: 0 },{ lean: true });
      let update = { password : md5(payloadData.newPassword) };
      let options = { new: true };
      let update_password = await DAO.findAndUpdate(Model,query,update,options );
      // console.log("update_password", update_password);
      if (update_password) {
        return update_password;
      } else {
        throw ERROR.WRONG_PASSWORD;
      }
    }
  } catch (err) {
    throw err;
  };
};

const data_to_update = async (data,userId) => {
  try {
    // console.log("data in update ",data) ;
    let data_to_save = {} ;
    if (data.full_name) { data_to_save.full_name = data.full_name } ;
    if (data.email) { data_to_save.email = data.email.toLowerCase() } ;
    if (data.socialKey) { data_to_save.socialKey = data.socialKey }
    if (data.profile_picture) { data_to_save.profile_picture = data.profile_picture } ;
    if(data.department_id){ data_to_save.department_id = data.department_id} ;
    if (data.password) { data_to_save.password = data.password }
    if (data.timeZone) { data_to_save.timeZone = data.timeZone }
    if (data.countryCode) { data_to_save.countryCode = data.countryCode }
    if (OTP){data_to_save.otp = 123456 }
    if (data.contact_number) { data_to_save.contact_number = data.contact_number}
    let create_user = await DAO.findAndUpdate(Models.users,{ _id : userId },data_to_save,{new  : true})
    return create_user ;
  }
  catch (err) {
    throw err;
  };
};

const social_login = async(payloadData) => {
  try{
    let query = { socialKey: payloadData.socialKey };
    let projection = { __v: 0 };
    let option = { lean: true };
    let fetch_data = await DAO.getData(Models.users, query, projection, option);
    if (fetch_data.length != 0){
      let create_user = await data_to_update(payloadData,fetch_data[0]._id);
      let token_info = {
        _id: create_user._id,
        collection: Models.users,
        scope: Config.APP_CONSTANTS.SCOPE.USER
      };
      let token_data = await commonController.generate_token(token_info);
      let get_data = await return_data(token_data);
      return get_data ;
    }else{
      if(payloadData.email) {
        /* *** check if email already exists or not ***** */
        let email_id = payloadData.email.toLowerCase() ;
        let check_email_exist = await commonController.check_user_email_exist(email_id) ;
        if(check_email_exist.length !=  0) {
          throw ERROR.EMAIL_ALREADY_EXIST ;
        };
      };
      let create_data = await data_to_save(payloadData) ;
      let token_info = {
        _id: create_data._id,
        collection: Models.users,
        scope: Config.APP_CONSTANTS.SCOPE.USER
      };
      let token_data = await commonController.generate_token(token_info) ;
      let get_data = await return_data(token_data);
      return get_data ;
    }
  }catch (err) {
    throw err;
  }
};

const add_companies = async(payloadData,userData) => {
  try{
    let Model = Models.companies ;
    let save_data ;
    if(payloadData.addresses){
      let addre = payloadData.addresses ; 
      for(let data of addre){
        if(data.name) {
          let data_to_save = {
            user_id : userData._id,
            name : data.name
          };
          save_data = await DAO.saveData(Model,data_to_save) ;
          // console.log("save_data",save_data);
        };
        
        // console.log(".....address..../",data.address);
        if(data.address) {
          /* ********* to save multiple addrsss of a single compny ****** */  
          let addres = data.address ;
          for(let data2 of addres) {
            let insert_data = {
              user_id : userData._id,
              company_id : save_data._id,
              address : data2
            } ;
            let save_address_data = await DAO.saveData(Models.compny_address,insert_data) ;
            // console.log("save_address_data ======",save_address_data) ;
            await DAO.findAndUpdate(Models.users,{_id : userData._id},{company_id : save_data._id,compny_address_id : save_address_data },{lean : true}) ;
          };
        }else{
          ERROR.EMAIL_ALREADY_EXIST ;
        };
      };
      let update_step1 = await DAO.findAndUpdate(Models.users,{_id : userData._id},{step1 : true},{lean : true}) ;
      return  save_data ;
    }else{
      throw ERROR.EMAIL_ALREADY_EXIST ;
    }
  }catch(err){
    throw err ;
  }
};

const list_companies = async(payloadData,userData) => {
  try{
    let Model = Models.companies ;
    let compny_address_data = [] ;
    let condtions = {
      user_id : userData._id,
    } ;
    let projection = {user_id : 1,name : 1,_id : 1, is_deleted : 1} ;
    let options = {lean : true } ;
    let fetch_all_data = await DAO.getData(Model,condtions,projection,options) ;
    if(fetch_all_data.length != 0){
      for(let data of fetch_all_data) {
        let fetch_address = await DAO.getData(Models.compny_address,{company_id : data._id,is_deleted : false},{_id : 1,user_id: 1,address :1,is_deleted : 1 ,company_id : 1},{lean : true}) ;
        if(fetch_address.length != 0){
          data.address_data = fetch_address ;
        }else{
          data.address_data = [] ;
        };
      };
    };
    return fetch_all_data ;
  }catch(err){
    throw err ;
  }
};

const list_company_address = async(payloadData,userData) => {
  try{
    // console.log(" ----- -payloadData ------",payloadData) ;
    let Model = Models.compny_address ;
    let condtions = {
      user_id : userData._id,
      company_id : payloadData.company_id
    } ;

    let projection = {__v : 0 } ;
    let options = {lean : true } ;
    let populate = [
      {
        path : "company_id",
        select : "_id name"
      },
      {
        path : "user_id",
        select : "_id full_name iso2_code country_code contact_number profile_picture department_id",
        populate : [
          {
            path  : "department_id",
            select : "_id name"
          }
        ]
      }
    ] 
    let fetch_all_data = await DAO.populate_Data(Model,condtions,projection,options,populate) ;
    return fetch_all_data ;
  }catch(err){
    throw err ;
  }
};

const list_plans = async(payloadData,userData) => {
  try{
    let Model  = Models.plans ;
    let queries = { is_deleted : false } ;
    let fetch_all_details = await DAO.getData(Model,queries,{__v : 0 }, { lean : true }) ;
    return fetch_all_details ;
  }catch(err){
    throw err ;
  };
};

const add_user_plan = async(payloadData,userData) => {
  try{
    let Model = Models.user_plans ;
    let current_date = moment().format('x') ;
    let data_for_save = {
      user_id  : userData._id,
      plan_id : payloadData.plan_id ,
      status :payloadData.status,
      purchase_date : current_date,
    };
    let save_plan_data  = await DAO.saveData(Model,data_for_save ) ;
    return save_plan_data ;
  }catch(err){
    throw err ;
  };
};

const list_user_plans = async(payloadData,userData) => {
  try{
    let Model = Models.user_plans ;
    let query = {
      user_id : userData._id,
      is_deleted : false
    } ;
    let fetch_data = await DAO.getData(Model,query,{__v : 0}, {lean : true}) ;
    return fetch_data ;
  }catch(err){
    throw err ;
  };
};

const list_company_members = async(payloadData,userData) => {
  try{
    console.log("payloadData in list_company_members ===",payloadData) ;
    let memberArray = [] ; 
    let allMembers = [] ;
    let fetchMembers = [] ;
    let totalMember = [] ;
    let fetch_all_data ;
    let fetch_chennel_members_ ;
    let uniqueArray = [] ;
    let array_of_chnnel_memebrs = [] ;
    let fetch_data_with_pagination ;
    let array_of_id  = [];
    let fetch_chennel_members ;
    let fetch_chennel_member ;
    let condtions ;
    /**fetch all the users which are blocked by me**/
    let fetch_all_blocked_users = await commonController.blocked_users_list(userData) ;
    if(fetch_all_blocked_users.length != 0){
      for(let detail of fetch_all_blocked_users){
        memberArray.push(detail.blocked_id) ;
      };
    };
    console.log("memberArray ------>>>>",memberArray) ; 
    if(payloadData.channel_id){
      fetch_chennel_members = await DAO.getData(Models.channel_members, {company_channels_id : payloadData.channel_id,is_deleted : false},{__v  : 0},{lean : true}) ;
      console.log("with cahnnel id ")
    }
    // else if(payloadData.task_id){
    //   fetch_chennel_members = await DAO.getData(Models.tasks_members, {task_id : payloadData.task_id,is_deleted : false},{__v  : 0},{lean : true}) ;
    //   console.log("with tasks_members id ")
    // }else if(payloadData.poll_id){
    //   console.log("with poll_id id ")
    //   fetch_chennel_members = await DAO.getData(Models.polls_members, {task_id : payloadData.poll_id,is_deleted : false},{__v  : 0},{lean : true}) ;
    // }else if(payloadData.meeting_id){
    //   console.log("with meeting_id id ")
    //   fetch_chennel_members = await DAO.getData(Models.meeting_members, {meeting_id : payloadData.meeting_id,is_deleted : false},{__v  : 0},{lean : true}) ;
    // }
    else{
      if(payloadData.compny_address_id){
        fetch_chennel_members = await DAO.getData(Models.channel_members, {company_id : payloadData.company_id,compny_address_id : {$in :[payloadData.compny_address_id]},is_deleted : false},{__v  : 0},{lean : true}) ;
      }else{
        fetch_chennel_members = await DAO.getData(Models.channel_members, { company_id : payloadData.company_id , is_deleted : false},{__v  : 0},{lean : true}) ;
      };
    };
    // console.log("fetch_chennel_members ----",fetch_chennel_members) ;
    if(fetch_chennel_members.length != 0){
      for(let ids of fetch_chennel_members){
        array_of_chnnel_memebrs.push(ids.member_id);
      };
    };
    console.log("array_of_chnnel_memebrs ----",array_of_chnnel_memebrs) ;
   
    if(memberArray.length != 0 ){
      console.log("memberArray.length != 0") 
      memberArray.push(userData._id) ;
      condtions =  {
        // $and : [
        //   {
        //     _id : { $nin : memberArray },
        //   },
        //   { 
        //     _id : { $in : array_of_chnnel_memebrs },
        //   }
        // ],
        _id :{ $nin : memberArray },
        compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
      console.log("condtions in if ----",condtions) ;
    }else if(memberArray.length != 0 && payloadData.type == "include"){
      console.log("memberArray.length != 0 && payloadData.type == include") 
      memberArray.push(userData._id) ;
      condtions =  {
        $and : [ { _id :{ $in : array_of_chnnel_memebrs }},{ _id :{ $nin : memberArray } } ] ,
        
        compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
    }else if (memberArray.length != 0 && payloadData.type == "exclude"){
      console.log("memberArray.length != 0 && payloadData.type == exclude") 
      condtions =  {
        _id : {$nin : [memberArray ,userData._id,array_of_chnnel_memebrs] },
        compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
    }else if(memberArray.length == 0 && payloadData.type == "include"){
      console.log("memberArray.length == 0 && payloadData.type == include") 
      condtions =  {
        $and : [
          { _id : {$in : array_of_chnnel_memebrs}},
          { _id : {$ne : userData._id}},
        ],
        compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
    }else if (memberArray.length == 0 && payloadData.type == "exclude"){
      console.log("memberArray.length == 0 && payloadData.type == exclude") 
      array_of_chnnel_memebrs.push(userData._id) ;
      condtions =  {
        _id : { $nin : array_of_chnnel_memebrs,},
        compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
    }else if(memberArray.length == 0 ){
      console.log("userData._id ------->>>",userData._id) ;
      condtions =  {
        $and : [
          {
            _id : { $nin : [ userData._id] },
          },
          // { 
          //   _id : { $in : array_of_chnnel_memebrs },
          // }
        ],
        // compny_address_id : payloadData.compny_address_id,
        company_id : payloadData.company_id ,
        isDeleted : false,
        isBlocked : false,
      };
      if(payloadData.company_id){
        condtions.compny_address_id = payloadData.compny_address_id; 
      }
      // console.log("condtions in memberArray.length == 0  ----",condtions) ;
    }
    let projection = { __v : 0};
    let options = { lean : true } ;
    /**** skipping number *******/
    let number = 0 ;
    if(payloadData.skipPage){ number = payloadData.skipPage } ; 

    fetch_data_with_pagination = await DAO.getDataUser(Models.users,condtions,projection,options,number) ;
    // console.log("fetch_data_with_pagination  ----",fetch_data_with_pagination) ;
    let queri_data = {company_id : payloadData.company_id,is_deleted : false};
    if(payloadData.compny_address_id){
      queri_data._id = payloadData.compny_address_id ;
    }
    let fetch_admins = await DAO.getData(Models.compny_address,queri_data,{__v : 0},{lean : false}) ;
      let fetch_user_data = await DAO.getDataOne(Models.users,{_id : fetch_admins[0].user_id},{__v : 0},{lean : true}) ;
      if(payloadData.task_id){
        fetch_chennel_members_ = await DAO.getData(Models.tasks_members, {member_id : {$nin :[userData._id]},task_id : payloadData.task_id,is_deleted : false},{__v  : 0},{lean : true}) ;
        console.log("with tasks_members id ")
        if(fetch_chennel_members_.length != 0){
          for(let f of fetch_chennel_members_){
            fetchMembers.push(f.member_id) ;
          };
          // console.log("fetchMembers -----",fetchMembers) ;
        }
      }else if(payloadData.poll_id){
        console.log("with poll_id id ")
        fetch_chennel_members_ = await DAO.getData(Models.polls_members, {member_id : {$nin :[userData._id]},task_id : payloadData.poll_id,is_deleted : false},{__v  : 0},{lean : true}) ;
        if(fetch_chennel_members_.length != 0){
          for(let f of fetch_chennel_members_){
            fetchMembers.push(f.member_id) ;
          };
          // console.log("fetchMembers -----",fetchMembers) ;
        }
      }else if(payloadData.meeting_id){
        console.log("with meeting_id id ")
        fetch_chennel_members_ = await DAO.getData(Models.meeting_members, {member_id : {$nin :[userData._id]},meeting_id : payloadData.meeting_id,is_deleted : false},{__v  : 0},{lean : true}) ;
        if(fetch_chennel_members_.length != 0){
          for(let f of fetch_chennel_members_){
            fetchMembers.push(f.member_id) ;
          };
          console.log("fetchMembers -----",fetchMembers) ;
          // let update_data = await DAO.updateMany(Models.users,{_id : {$in :fetchMembers}},{is_included : true},{new : true}) ;
        }
      }
      // fetch_data_with_pagination.filter(element => fetch_chennel_members_.includes(element.id) ;
      
      // console.log("allMembers -----",allMembers) ;
      
        // for(let i of allMembers){
        //   if(i.includes)
        // }
      //   for ( var i = 0; i < allMembers.length; i++ ) {
      //     for ( var e = 0; e < fetchMembers.length; e++ ) {
      //         if ( allMembers[i] === fetchMembers[e] ) totalMember.push( a[i] );
      //     }
      // }
        // totalMember  = allMembers.map(element => {
        //   return fetchMembers.includes(element);
        // });
      // if(allMembers.includes(fetchMembers) == true){
      //   totalMember.push()
      // }
      // if(allMembers.length != 0){
      //   if(fetchMembers.length != 0){
      //     for(let d of allMembers){
      //       for(let l of fetchMembers){
      //         if(d == l){
      //           totalMember.push(d );
      //         }
      //       }
          
            
      //     }
      //   }
        
      // }

      // let allMembers = [] ;
      // let fetchMembers = [] ;
      // let totalMember = [] ;
      // )


    if(fetch_data_with_pagination.length != 0){ 
      // console.log("fetch_chennel_members_ ----",fetch_chennel_members_.length) ;
      for(let data of fetch_data_with_pagination){
        // if(fetchMembers.length != 0){
          // console.log("data ----",data._id) ;
          // console.log("fetchMembers ---",fetchMembers) ;
          // if(fetchMembers.includes(data._id)){
          //   data.isIncluded = false
          // }else{
          //   data.isIncluded = true
          // }
          let ids = data._id ; 
          if(fetchMembers.includes(ids) ){
            // console.log("true ---",fetchMembers.includes(data._id));
            data.is_included = true
          }else{
            // console.log("false ---",fetchMembers.includes(data._id));
            data.is_included = false
          }
          // for(let detial of fetchMembers){
          //   console.log("detial ---",detial) ;
          //   if(detial  == data._id){
          //     console.log("here i m ----") ;
          //     data.isIncluded = true
          //   }else{
          //     console.log("there i m ----") ;
          //     data.isIncluded = false
          //   }
          // }
        // }
      // console.log("data----",data._id) ;
      //   if(fetch_chennel_members_.length != 0){
      //     for(let data3 of fetch_chennel_members_){
      //       console.log("data3 ----",data3.member_id) ;
      //       // console.log("data ----",data._id) ;
      //       if(Object.entries(data._id).toString() === Object.entries(data3.member_id).toString()){
      //         console.log("------ here workimg ----") ;
      //         data.isAdded = true ;
      //       }else{
      //         console.log("there workimg ----") ;
      //         data.isAdded = false ;
      //       }
      //     }
      //   }





        // let query_for_chat = {
        //   channel_id : data._id,
        //   is_deleted : false,
        //   status_data : {
        //     $elemMatch : {
        //       user_id : userData._id,
        //       is_read : false,
        //       is_deleted : false
        //     }
        //   }
        //   // "status_data.is_read" : false,
        // };
        // let fetch_unread_message = await DAO.getData(Models.chats,query_for_chat,{__v : 0},{lean : true });
        // if(fetch_unread_message.length != 0){
        //   data.unread_message = fetch_unread_message.length ;
        // }else{
        //   data.unread_message = 0 ;
        // }
        if(data._id === fetch_user_data._id ){

        }else{
         

          // console.log("data  ----",data) ;
          uniqueArray.push(data) ;
        };
      }
      fetch_data_with_pagination.push(fetch_user_data) ;
    }else if(fetch_data_with_pagination.length == 0){
      console.log("there is rnning");
      let fetch_admins = await DAO.getData(Models.compny_address,{_id : payloadData.compny_address_id,company_id : payloadData.company_id,is_deleted : false},{_id : 1},{lean : false}) ;
      // console.log("fetch_admins ----",fetch_admins) ;
      
      if(fetch_admins.length != 0){
        let fetch_user_data = await DAO.getDataOne(Models.users,{_id : fetch_admins[0].user_id},{__v : 0},{lean : true}) ;
        console.log("fetch_user_data ----",fetch_user_data) ;
        for(let data of fetch_data_with_pagination){  
          if(data._id == fetch_user_data._id ){
          }else{
           uniqueArray.push(data) ;
          };
        }
      }
    };
    return {
      Count : uniqueArray.length,
      fetch_data_with_pagination :uniqueArray   
    } ;   
  }catch(err){
    throw err ;
  };
};

const invite_company_members = async(payloadData,userData) => {
  try{
    let data_to_return ;
    if(payloadData.members){
      let mem = payloadData.members ;
      // console.log("mem  console in invite members -----",payloadData.members) ;
      // console.log("mem  console in invite members -----",mem) ;
      for(let data of mem){
        let emails = data.email ;
        for(let d of emails){
          // console.log("email in step3 .....",d) ;
          let fetch_email_exists = await commonController.check_user_email_data(d) ;
        
          if(fetch_email_exists.length != 0) {
                throw ERROR.EMAIL_ALREADY_EXIST ;
          };
          let if_email_valid = await commonController.check_email_validation(d) ;
          if(if_email_valid.result === false){
                throw ERROR.EMAIL_VALIDATION ;
          };
        };
        let data_to_validate =  {
          user_id : userData._id,
          company_id : data.company_id,
          compny_address_id : data.compny_address_id,
          email : data.email,
        };
        
        await commonController.if_data_validates_or_not(data_to_validate) ;

        let query  = {
              company_id : data.company_id ,
              is_deleted : false
        }
        let projection = {_id : 1}
        let option ={ lean : true }
        // let match = await DAO.getData(Models.invite_members,query,projection,option)
        // /*** case 1 ****/
        // if(match.length != 0){
        //   console.log("case 1 is working") ;
        //   data_to_return = await commonController.case2(data_to_validate) ;
          
        // }else{
          if(data.channel_id){
            let data_to_add =  {
              user_id : userData._id,
              company_id : data.company_id,
              compny_address_id : data.compny_address_id,
              email : data.email,
              channel_id : data.channel_id
            };
            // console.log("data_to_add =====",data_to_add );
            await commonController.save_invited_members_to_specific_members(data_to_add,userData._id) ;

          }else{
              // console.log("case 2 is working");
              data_to_return = await commonController.save_invited_members(data_to_validate,userData._id);
          }
        
        // }
      }
      let update_step2 = await DAO.findAndUpdate(Models.users,{_id : userData._id},{step3 : true},{lean : true}) ;
      return {
        company_id  : mem[0].company_id ,
        compny_address_id : mem[0].compny_address_id ,
      };      
    }else{
      throw ERROR.DEFAULT ;
    };
  }catch(err){
    throw err ;
  };
};

const add_channels = async(payloadData,userData) => {
  try{
    let compnyAdresAray = [] ;
    let Model = Models.company_channels ;
    let save_default_channel ; 
    if(payloadData.all_data){
      // console.log("payloadData.all_data -----",payloadData.all_data) ;
      for(let data of payloadData.all_data){
        // console.log("data ---",data) ;
        let data_for_save = {
          user_id : userData._id,
          company_id : data.company_id
        };
        /**** if channel is selected for all locations ******/
        if(data.location_type == "All"){
          let fetch_all_address = await DAO.getData(Models.compny_address ,{ company_id :  data.company_id,user_id : userData._id,is_deleted : false},{__v : 0},{lean : true}) ;
          if(fetch_all_address.length != 0){
            for(let data_all of fetch_all_address){
              compnyAdresAray.push(data_all._id );
            };
          };
          // console.log("compnyAdresAray -------",compnyAdresAray) ;
          
            data_for_save.channel_name  = data.channel_name ;
            data_for_save.compny_address_id  = compnyAdresAray;
            save_default_channel = await DAO.saveData(Model,data_for_save) ;
            // console.log("save_default_channel --------",save_default_channel) ;
            let insert_data = {
              company_channels_id : save_default_channel._id,
              member_id : userData._id,
              is_admin : true,
              // data_for_save.compny_address_id
              company_id : data.company_id,
              compny_address_id : compnyAdresAray 
            };
            // if(compnyAdresAray.length != 0){
            //   let detail = insert_data.compny_address_id
            //   detail.push(compnyAdresAray ) ;
            // }
            let save_members = await DAO.saveData(Models.channel_members,insert_data) 
            // let include_myself_in_channel = await DAO.saveData(Models.)
            // console.log("save_default_channel in all---",save_default_channel) ;
            
            // };
            let update_step2 = await DAO.findAndUpdate(Models.users,{_id : userData._id},{step2 : true},{lean : true}) ;
            // return save_default_channel ;
        } 
        if(data.location_type == "One"){
          /**** if channel is selected for one location ******/
          let loc = data.location ; 
          for(let data2 of loc){
            // let if_compny_addess_exist  = await commonController.check_compny_adeess_exist(data2) ;
            // if(if_compny_addess_exist.length != 0){
            //   throw ERROR.ADDRESS_NOT_EXIST ;
            // }
            data_for_save.compny_address_id = data2 ;
            data_for_save.channel_name  = data.channel_name ;

            save_default_channel = await DAO.saveData(Model,data_for_save) ;
            // console.log("save_default_channel in ond---",save_default_channel) ;
            let insert_data = {
              company_channels_id : save_default_channel._id,
              member_id : userData._id,
              company_id : data.company_id,
              compny_address_id : data2,
              is_admin : true,
            };
            let save_members = await DAO.saveData(Models.channel_members,insert_data) ;
          };
          let update_step2 = await DAO.findAndUpdate(Models.users,{_id : userData._id},{step2 : true},{lean : true}) ;
        }
        if(data.location_type == "Multiple"){
          /**** if channel is selected for multiple locations ******/
          let loc = data.location ; 
          // for(let data2 of loc){
            // let if_compny_addess_exist  = await commonController.check_compny_adeess_exist(data2) ;
            // if(if_compny_addess_exist.length != 0){
            //   throw ERROR.ADDRESS_NOT_EXIST ;
            // }
            data_for_save.compny_address_id = loc ;
            data_for_save.channel_name  = data.channel_name ;

            save_default_channel = await DAO.saveData(Model,data_for_save) ;
            // console.log("save_default_channel in multiple--",save_default_channel) ;
            let insert_data = {
              company_channels_id : save_default_channel._id,
              member_id : userData._id,
              company_id : data.company_id,
              is_admin : true,
              compny_address_id : loc
            };
            let save_members = await DAO.saveData(Models.channel_members,insert_data) ;
          // } ;
          let update_step2 = await DAO.findAndUpdate(Models.users,{_id : userData._id},{step2 : true},{lean : true}) ;
        }         
      }
      return save_default_channel ;
    }
  }catch(err){
    throw err ;
  };
};

const add_edit_channels_with_members = async(payloadData,userData) => {
  try{
    // console.log("payloadData in add_edit_channels_with_members----->>>",payloadData);
    let data_to_save = {
      user_id : userData._id,
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id
    };
    if(payloadData.channel_name){  data_to_save.channel_name = payloadData.channel_name ; };
    if(payloadData.image){data_to_save.image = payloadData.image ;};
    if(payloadData.description){data_to_save.description = payloadData.description ;};
    // console.log("checking data_to_save ------>>>",userData) ;

    if(payloadData._id){
      let update = {
        _id : payloadData._id,
        is_deleted : false
      };
      let update_cahnnel = await DAO.findAndUpdate(Models.company_channels,update,data_to_save,{new : true}) ;
      return update_cahnnel ;
    }else{
    let save_all_details = await DAO.saveData(Models.company_channels,data_to_save) ;
    if(payloadData.channel_member){
      /***** to add members in a channel ******/
      let members = payloadData.channel_member ;
      let including_myself = members.push({ member : userData._id }) ;
      for(let data of members){
        let fetch_if_member_already_added = await commonController.check_if_member_already_added(data,save_all_details._id,payloadData) ;
        if(fetch_if_member_already_added.length != 0){
        }else{
          let insert_data = {
            company_channels_id : save_all_details._id,
            member_id : data.member,
            company_id : payloadData.company_id,
            compny_address_id : payloadData.compny_address_id
          };
          let save_members = await DAO.saveData(Models.channel_members,insert_data) ;
        }
      };  
      let make_myself_admin = await DAO.findAndUpdate(Models.channel_members,{ company_channels_id : save_all_details._id,member_id :userData._id,is_deleted : false},{is_admin : true},{new : true})   ;
    };
    // console.log("save_all_details ----->>>",save_all_details);
    return save_all_details ;
  }
  }catch(err){
    throw err ;
  }
};

const list_channels_with_count = async(payloadData,userData) => {
  try{
    let fetch_all_channels  ;
    let blockMembers = [] ;
    let allData =  [] ;
    let query_for_members ;
    let conditions  ;
    if(payloadData.type == "admin" &&  payloadData.compny_address_id == null  ){
      conditions ={
        member_id : userData._id,
        company_id : payloadData.company_id,
        is_deleted : false
      };
      console.log("1st cndition")
    }else if(payloadData.type == "admin" && payloadData.compny_address_id != null){
      // console.log("payloadData.compny_address_id ------>>>>",payloadData.compny_address_id) ;
      conditions = {
        member_id : userData._id,
        company_id : payloadData.company_id,
        compny_address_id : {$in :[payloadData.compny_address_id]},
        // compny_address_id :payloadData.compny_address_id,
        is_deleted : false
      };
      // console.log("conditions 2nd------>>>>",conditions) ;
    }else if (payloadData.type == "user" && payloadData.compny_address_id == null){
      throw ERROR.ADDRESS_IS_REQUIRED ;
    }else if(payloadData.type == "user" && payloadData.compny_address_id != null){
      conditions = {
        member_id : userData._id,
        company_id : payloadData.company_id,
        compny_address_id : {$in :[ payloadData.compny_address_id ]},
        is_deleted : false
      };
      console.log("4th cndition")
    };

    let proejction = {__v : 0 } ;
    let option = {lean : true} ;
    let fetch_all_channel_data  = await DAO.getData(Models.channel_members,conditions,proejction,option) ;
    // console.log("fetch_all_channel_data -----",fetch_all_channel_data) ;
    if(fetch_all_channel_data.length != 0){
      for(let detail of fetch_all_channel_data){
        let conditon_for_cahnnel = {
          _id : detail.company_channels_id,
          is_deleted : false
        }

    
        fetch_all_channels = await DAO.getData(Models.company_channels,conditon_for_cahnnel,proejction,option) ;
        // console.log("fetch_all_channels -----",fetch_all_channels) ;
        /*** fetch all users blocked by me ***/
        let fetch_users = await commonController.blocked_users_list(userData) ;
        if(fetch_users.length != 0){
          for(let blck of fetch_users){
            blockMembers.push(blck.blocked_id) ;
          };
        };
        if(fetch_all_channels.length != 0){
          for(let data of fetch_all_channels){
            let query_for_chat = {
              channel_id : data._id,
              is_deleted : false,  
              sender_id : {$nin : [userData._id]},
              status_data :{ $elemMatch: {   user_id : userData._id, is_deleted : false ,is_read : false  }}
            };
            // console.log("query_for_chat -----",query_for_chat) ;
            // let fetch_unread_message = await commonController.fetch_unread_group_message(data,userData) ;
            let get_data = await DAO.getData(Models.chats,query_for_chat,{__v : 0},{lean : true });
            // console.log("fetch_unread_message  ----",fetch_unread_message) ;
            if(get_data.length != 0){
              data.unread_message = get_data.length ;
            }else{
              data.unread_message = 0 ;
            }
            let count = 0 ;
            console.log("else condition in list_channels_with_count")
            query_for_members = {
              company_channels_id : data._id,
              is_deleted : false
            };
            if(blockMembers.length != 0){
              query_for_members.member_id = { $nin : blockMembers };
            };
            let populate = [
              {
                path :"member_id", 
                select : "_id full_name"
              }
            ]
            /*** listing of members of the channel **** */
            let get_count_of_channel_members = await DAO.populate_Data(Models.channel_members,query_for_members,{__v : 0},{ lean : true },populate) ;
            if(get_count_of_channel_members.length != 0){
              let total_count = get_count_of_channel_members.length ;
              data.count = total_count 
              let member_name = get_count_of_channel_members.map( member =>{
                return member.member_id.full_name ;
              })
              data.memberNames = member_name ;
              allData.push(data) ;
            }
          }; 
        }
      } 
    };
    return allData ;
  }catch(err){
    throw err ;
  };
};


const add_edit_tasks = async(payloadData,userData) => {
  try{
    if(userData.wallet_ammount < payloadData.coins){
      throw ERROR.INSUFFICIENT_BALANCE  ;
    };
    // console.log("payloadData  in task api--------",payloadData) ;
    let data_for_db ={
      user_id : userData._id,
    };
    if(payloadData.company_id){ data_for_db.company_id = payloadData.company_id } ; 
    if(payloadData.compny_address_id){ data_for_db.compny_address_id = payloadData.compny_address_id } ; 
    if(payloadData.channel_id){ data_for_db.channel_id = payloadData.channel_id } ; 
    if(payloadData.status){ data_for_db.status = payloadData.status } ; 
    if(payloadData.title){ data_for_db.title = payloadData.title } ;
    if(payloadData.description){ data_for_db.description = payloadData.description } ;
    if(payloadData.start_date){ 
      data_for_db.start_date_in_string = payloadData.start_date  ;
      let dates = payloadData.start_date ;
      let date_in_milli = moment(dates,"YYYY/MM/DD").format('x') ;
      data_for_db.start_date = date_in_milli  ;
    };
    if(payloadData.end_date){ 
      data_for_db.end_date_in_string = payloadData.end_date  ;
      let dates = payloadData.end_date ;
      let date_in_milli = moment(dates,"YYYY/MM/DD").format('x') ;
      data_for_db.end_date = date_in_milli  ;
    };
    if(payloadData.recurring){ data_for_db.recurring = payloadData.recurring } ;
    if(payloadData.coins){ data_for_db.coins = payloadData.coins } ;

    if(payloadData._id){
      // console.log("console while editing task ----:",payloadData) ;
      // console.log("data_for_db while editing --------------->>>>",data_for_db) ;
      /***** to edit specific task ****/
      let query_for_edit = {
        _id : payloadData._id,
        is_deleted : false 
      };
      let show_edited_task  = await DAO.findAndUpdate(Models.tasks,query_for_edit,data_for_db,{new : true }) ;
      // console.log("show_edited_task while editing --------------->>>>",show_edited_task) ;
      /*** add members to the task ****/
      if(payloadData.members){
        let fetch_all_members = await DAO.getData(Models.tasks_members,{task_id : payloadData._id,is_deleted : false},{__v : 0},{lean : true}) ;
        
        let member = payloadData.members ;
        for(let data of member) {
          let insert_data = {
            task_id : payloadData._id,
            member_id : data.member_id,
            company_id : payloadData.company_id,
            compny_address_id : payloadData.compny_address_id
          };
          let save_task_members = await DAO.saveData(Models.tasks_members,insert_data) ;
          let task_assigned_notification  = await notificationController.send_task_assign_noti(insert_data,userData._id) ;
        };
      };
      return show_edited_task ;
    }else{
      let save_task_data = await DAO.saveData(Models.tasks,data_for_db) ;
      /*** add members to the task ****/
      if(payloadData.members){
        let member = payloadData.members ;
        /**  assigning myself to the tasks ***/
        let including_myself = member.push({ member_id: userData._id }) ;
        for(let data of member) {
          let insert_data = {
            task_id : save_task_data._id,
            member_id : data.member_id,
            company_id : payloadData.company_id,
            compny_address_id : payloadData.compny_address_id
          };
          let save_task_members = await DAO.saveData(Models.tasks_members,insert_data) ;
          let task_assigned_notification  = await notificationController.send_task_assign_noti(insert_data,userData._id) ;
        };  
      };
      // console.log("save_task_data --------",save_task_data) ;
      return save_task_data ;
    };
  }catch(err){
    throw err ;
  };
};

// const list_channels_with_count = async(payloadData,userData) => {
//   try{
//     let blockMembers = [] ;
//     let memberNames =  [] ;
//     let query_for_members ;
//     let conditions  ;
//     if(payloadData.type == "admin" &&  payloadData.compny_address_id == null  ){
//       conditions ={
//         // user_id : userData._id,
//         is_deleted : false
//       }
//     }else if(payloadData.type == "admin" && payloadData.compny_address_id != null){
//       console.log("payloadData.compny_address_id ------>>>>",payloadData.compny_address_id) ;
//       conditions = {
//         // user_id : userData._id,
//         company_id : payloadData.company_id,
//         compny_address_id : {$in :[payloadData.compny_address_id]},
//         is_deleted : false
//       };
//       console.log("conditions ------>>>>",conditions) ;
//     }else if (payloadData.type == "user" && payloadData.compny_address_id == null){
//       throw ERROR.ADDRESS_IS_REQUIRED ;
//     }else if(payloadData.type == "user" && payloadData.compny_address_id != null){
//       conditions = {
//         // user_id : userData._id,
//         company_id : payloadData.company_id,
//         compny_address_id : {$in :[ payloadData.compny_address_id ]},
//         is_deleted : false
//       };
//     };

//     let proejction = {__v : 0 } ;
//     let option = {lean : true} ;

//     let fetch_all_channels = await DAO.getData(Models.company_channels,conditions,proejction,option) ;
//     /*** fetch all users blocked by me ***/
//     let fetch_users = await commonController.blocked_users_list(userData) ;
//     if(fetch_users.length != 0){
//       for(let blck of fetch_users){
//         blockMembers.push(blck.blocked_id) ;
//       };
//     };
//     if(fetch_all_channels.length != 0){
//       for(let data of fetch_all_channels){
//         let query_for_chat = {
//           channel_id : data._id,
//           is_deleted : false,  
//           status_data :{ $elemMatch: { is_deleted : false, user_id : userData._id, is_read : false  }}
//         };
//         console.log("query_for_chat -----",query_for_chat) ;
//         // let fetch_unread_message = await commonController.fetch_unread_group_message(data,userData) ;
//         let get_data = await DAO.getData(Models.chats,query_for_chat,{__v : 0},{lean : true });
//         // console.log("fetch_unread_message  ----",fetch_unread_message) ;
//         if(get_data.length != 0){
//           data.unread_message = get_data.length ;
//         }else{
//           data.unread_message = 0 ;
//         }
//         let count = 0 ;
//         console.log("else condition in list_channels_with_count")
//         query_for_members = {
//           company_channels_id : data._id,
//           is_deleted : false
//         };
//         if(blockMembers.length != 0){
//           query_for_members.member_id = { $nin : blockMembers };
//         };
//         let populate = [
//           {
//             path :"member_id", 
//             select : "_id full_name"
//           }
//         ]
//         /*** listing of members of the channel **** */
//         let get_count_of_channel_members = await DAO.populate_Data(Models.channel_members,query_for_members,{__v : 0},{ lean : true },populate) ;
//         if(get_count_of_channel_members.length != 0){
//           let total_count = get_count_of_channel_members.length ;
//           data.count = total_count 
//           let member_name = get_count_of_channel_members.map( member =>{
//             return member.member_id.full_name ;
//           })
//           data.memberNames = member_name ;
//         }else{
//           data.count = 0 ;
//           data.memberNames  = []
//         };
//       };  
//     };
//     return fetch_all_channels ;
//   }catch(err){
//     throw err ;
//   };
// };

const delete_task = async(payloadData,userData) => {
  try{
    let condition = {
      user_id : userData._id,
      _id : payloadData._id,
    };
    let data_to_update  = {} ;
    if(payloadData.is_deleted === true || payloadData.is_deleted === false){
      data_to_update.is_deleted = payloadData.is_deleted ;
    };
    let fetch_detailed_task = await DAO.findAndUpdate(Models.tasks,condition,data_to_update,{ new : true }) ;
    /**** delete assigned membrs of the task ****/
    let delete_assigned_members = await DAO.updateMany(Models.tasks_members,{task_id : payloadData._id },{is_deleted : true},{new : true}) ;
    return fetch_detailed_task ;
  }catch(err){
    throw err ;
  };
};

const task_complete_by_user = async(payloadData,userData) => {
  try{
    let Model = Models.tasks_members ;
    let conditon = {
      task_id : payloadData.task_id,
      member_id : userData._id,
      is_deleted : false
    };
    let udpate_data =  {} ;
    if(payloadData.task_completed === true || payloadData.task_completed === false ){
      udpate_data.task_completed = payloadData.task_completed ;
    };
    if(payloadData.task_video){   udpate_data.task_video = payloadData.task_video ;};
    let complete_assign_task = await DAO.findAndUpdate(Model,conditon,udpate_data,{new : true }) ;
    let fetch_member_data = await DAO.getDataOne(Models.users,{_id : userData._id,isDeleted  : false},{__v : 0},{lean : true }) ;
    let fetch_task_data = await DAO.getDataOne(Models.tasks,{_id : payloadData.task_id,is_deleted : false},{__v : 0},{lean : true }) ;

    /*** send noticaition */
    let noti_data = {
      reciever_id : fetch_task_data.user_id,
      sender_id : userData._id,
      type : "TASK_COMPLETE",
      title : fetch_task_data.title + " completed by " + fetch_member_data.full_name,
      highlight_message : "Mark done",
      date : moment().format('x'),
      task_title : fetch_task_data.title,
      task_video : payloadData.task_video,
      task_id : fetch_task_data._id,
      task_description : fetch_task_data.description,
      message : fetch_member_data.full_name + " has mark task completed",
    };
    let send_noti = await notificationController.send_task_complete_notification(noti_data) ;
    return complete_assign_task  ;
  }catch(err){
    throw err  ;
  };
};

const list_notification = async(payloadData,userData) => {
  try{
    let Model = Models.notifications ;
    let query = {
      reciever_id : userData._id,
      is_deleted : false
    };
    let populate = [
      {
        path : "reciever_id",
        select : "_id  full_name profile_picture"
      },
      {
        path : "sender_id",
        select : "_id  full_name profile_picture"
      },
      
      {
        path : "member_id",
        select : "_id  full_name profile_picture"
      },
      
    ]
    let num = 0 ;
    if(payloadData.skipPage){
      num = payloadData.skipPage ;
    };
    let query_for_unread = {
      reciever_id : userData._id,
      is_deleted : false,
      is_read : false
    }
    let fetch_all_notifcations = await DAO.populateDataUser(Model,query,{__v : 0},{lean : true},populate,num) ;
    let make_noti_unread = await DAO.updateMany(Model,query_for_unread,{is_read : true},{new : true}) ;
    let get_count = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
    return {
      Count : get_count.length,
      fetch_all_notifcations
    };
  }catch(err){
    throw err ;
  };
};

const list_unread_notification = async(payloadData,userData) => {
  try{
    let Model = Models.notifications ;
    let query = {
      reciever_id : userData._id,
      is_deleted : false,
      is_read : false,
    };
    let fetch_noti_data = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
    return {
      Count : fetch_noti_data.length
    };
  }catch(err){
    throw err ;
  }
}

const delete_notifcations = async(payloadData,userData) => {
  try{
    let Model = Models.notifications ;
    let query = { 
      reciever_id : userData._id,
    } ;
    let updated_condition = {} ;
    if(payloadData.is_deleted == true || payloadData.is_deleted == false){
      updated_condition.is_deleted = payloadData.is_deleted ;
    };
    if(payloadData._id){
      let query_data  = {
        // reciever_id : userData._id,
        _id : payloadData._id,
      };
      // console.log("updated_condition --------",updated_condition) ;
      let delete_single_noti = await DAO.findAndUpdate(Model,query_data,updated_condition,{new : true });
      // console.log("delete_single_noti --------",delete_single_noti) ;
      return delete_single_noti ;
    };
    let  delete_noti = await DAO.updateMany(Model,query,updated_condition,{new : true }) ;
    return delete_noti ;
  }catch(err){
    throw err ;
  };
};



const list_task_by_id = async(payloadData,userData) => {
  try{
    let task_completed = [] ;
    let Model = Models.tasks ;
    let query = {
      _id :payloadData._id,
      is_deleted : false
    };
    let populate = [
      {
        path : "user_id",
        select : "_id profile_picture full_name"
      }
    ]
    let fetch_task = await DAO.populate_Data(Model,query,{__v : 0},{lean : true },populate);
    // console.log(" fetch_task   ---",fetch_task) ;
    if(fetch_task.length != 0){
      let poplate_data = [
        {
          path : "member_id",
          select : "_id full_name country_code contact_number profile_picture email"
        }
      ]
      let fetch_all_members= await DAO.populate_Data(Models.tasks_members,{ task_id : payloadData._id,is_deleted : false},{__v : 0},{lean : true },poplate_data);
      let task_completed_query = { 
        task_id : payloadData._id,
        task_completed_by_admin : true,
        is_deleted : false
      };
      let fetch_completed_task = await DAO.populate_Data(Models.tasks_members,task_completed_query,{__v : 0},{lean : true},poplate_data ) ;
      for(let data of fetch_task){
        data.member = fetch_all_members ;
        if(fetch_completed_task.length != 0){
          data.task_completed = fetch_completed_task
        }else{
          data.task_completed = [] ;
        };
      }
    }
    return  fetch_task ;
  }catch(err){
    throw err ;
  }
};

const complete_past_tasks = async() => {
  try{
    let current_time = moment().startOf('day').format('x') ;
    let Model = Models.tasks ;
    let query ={
      status :  {$nin : ["Complete","Overdue"]},
      end_date : {$lt : current_time },
      is_deleted  : false,
    };
    let update ={
      status : "Overdue"
    }
    await DAO.updateMany(Model,query,update,{new : true}) ;
  }catch(err){
    throw err ;
  };
};

const list_assigned_task = async(payloadData,userData) => {
  try{
    // 86400000
    let current_time = moment().format('x') ;
    // console.log("current_time 1735 line ----<>>>>>",current_time) ;

    let fetch_task_data = await complete_past_tasks() ;
    // console.log("payloadData in list_assigned_task",payloadData) ;
    let memberArray = [] ;
    let blockMember = [] ;
    let fetch_task_members_id = {
      member_id : userData._id,
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      is_deleted : false
    } ;
    if(payloadData._id){
      fetch_task_members_id = {
        task_id : payloadData._id,
        member_id : userData._id,
        company_id : payloadData.company_id,
        compny_address_id : payloadData.compny_address_id,
        is_deleted : false
      } ;
    };
    let fetch_task_ids = await DAO.getData(Models.tasks_members,fetch_task_members_id,{__v  : 0},{ lean : true }) ;
    // console.log("fetch_task_ids ---",fetch_task_ids) ;
    let all_tasks = [] ;
    let get_tasks ;
    let member_query  ;
    /*** fetch all users blocked by me ***/
    let fetch_users = await commonController.blocked_users_list(userData) ; 
    if(fetch_task_ids.length != 0){
      for(let data of fetch_task_ids){
        // console.log("data ---",data) ;
        /*** fetch tasks assigned to the user ****/
        let query_for_fetching_task = {
          _id : data.task_id,
          is_deleted : false
        };
        if(payloadData.status){ 
          query_for_fetching_task.status = payloadData.status ;
        };
        if(fetch_users.length !=0){
          for(let blockdata of fetch_users){
            blockMember.push(blockdata.blocked_id) ;
          };
        };
        if(blockMember.length != 0){
          query_for_fetching_task.user_id = {$nin : blockMember} 
        };
        let populate1 = [
          {
            path : "user_id",
            select  : "_id full_name user_id profile_picture company_id compny_address_id"
          },
          {
            path : "channel_id",
            select : "_id channel_name" 
          }
        ]
        get_tasks = await DAO.populate_Data(Models.tasks,query_for_fetching_task,{__v : 0},{lean : true},populate1) ;
        // console.log("get_tasks ---",get_tasks) ;
        if(get_tasks.length != 0){
          for(let task of get_tasks){
            member_query = {
              task_id : task._id,
              is_deleted : false,
            };
            if(fetch_users.length != 0) {
              for(let d of fetch_users){
                memberArray.push(d.blocked_id) ;
              };
            };
            if(memberArray.length != 0){
              member_query.member_id = {$nin : memberArray}
            };
            let populate = [
              {
                path : "member_id",
                select : "_id full_name country_code contact_number profile_picture email company_id compny_address_id"
              }
            ]
            let fetch_task_mebers = await DAO.populate_Data(Models.tasks_members,member_query,{__v  : 0},{ lean : true },populate) ;
            if(fetch_task_mebers.length != 0 ){
              /* fetch profile pics of the members */
              task.member = fetch_task_mebers ;
            };
            all_tasks.push(task) ;
          }
        }  
      };
    };
    // console.log("console in list tasks --------->>>>",all_tasks) ;
    return all_tasks ;  
  }catch(err){
    throw err ;
  };
};

const fetch_task_details = async(payloadData,userData)=>{
  try{
    let query_for_members ;  /* variable for query in fething members*/
    var fetch_members ;   /* variable for fetching all data */
    let query = {
      _id : payloadData._id,
      is_deleted : false
    };
    let populate =[
      {
        path :"user_id",
        select : " _id profile_picture email contact_number full_name"
      }
    ]
    let fetch_task_data = await DAO.populate_Data(Models.tasks,query,{ __v : 0 },{ lean : true },populate) ;
    if(fetch_task_data.length != 0){
      for(let data of fetch_task_data){
        /**fetching all the users blocked by me **/
        let fetch_users = await commonController.blocked_users_list(userData) ;
        if(fetch_users.length != 0){
          for(let user of fetch_users){
            query_for_members = {
              member_id : {$nin : user.blocked_id},
              task_id : data._id,
              is_deleted : false
            };
          };
        }else{
          query_for_members = {
            task_id : data._id,
            is_deleted : false
          };
        };
        let proejction = {__v : 0} ;
        let populate = [
          {
            path : "member_id",
            select : "_id profile_picture email contact_number full_name"
          }
        ]
        fetch_members = await DAO.populate_Data(Models.tasks_members,query_for_members,proejction,{ lean : true },populate) ;
        data.member = fetch_members ;
      };
      return fetch_task_data ;
    };
  }catch(err){
    throw err ;
  };
};

const change_availability = async(payloadData,userData) => {
  try{
    let condition = {
      _id : userData._id,
      isDeleted : false,
      isBlocked : false
    };
    let update_data = {} ;
    if(payloadData.isAvailable === true || payloadData.isAvailable === false){
      update_data.isAvailable = payloadData.isAvailable ;
    };
    let return_changed_availability = await DAO.findAndUpdate(Models.users,condition,update_data,{new : true}) ;
    return return_changed_availability ;
  }catch(err){
    throw err ;
  };
};

const add_edit_polls = async(payloadData,userData) => {
  try{
    // console.log("payloadData  overalll polls ---",payloadData) ;
    let data_to_add ={
      user_id : userData._id,
      compny_address_id : payloadData.compny_address_id,
      company_id : payloadData.company_id 
    };
    if(payloadData.channel_id){  data_to_add.channel_id = payloadData.channel_id } ;
    if(payloadData.question){  data_to_add.question = payloadData.question } ;
    if(payloadData.start_date){  
      let dates = payloadData.start_date  ;
      let date_in_milli = moment(dates,"YYYY/MM/DD").format('x') ;
      data_to_add.start_date = date_in_milli ;
      data_to_add.start_date_in_string =  dates ;
    } ;
    if(payloadData.end_date){
      let date1 = payloadData.end_date ;
      let date_in_milli = moment(date1,"YYYY/MM/DD").format('x') ;
      data_to_add.end_date = date_in_milli ;
      data_to_add.end_date_in_string =  date1 ;
    };
    if(payloadData._id){
      // console.log("payloadData in edit polls ---",payloadData) ;
          /***  to change multiple answers based on _id ***/
          if(payloadData.answer_name){
                let change_ans = payloadData.answer_name ;
                for(let ans1 of change_ans){
                  if(ans1._id != null){

                      let query_for_ans = { _id : ans1._id } ;
                      let update_ans = { answer : ans1.answer } ;
                      let return_updated_answers = await DAO.findAndUpdate(Models.polls_answers,query_for_ans,update_ans,{ new : true }) ;
                  }else{
                    let save_values = {
                      poll_id : payloadData._id,
                      answer : ans1.answer,
                      compny_address_id : payloadData.compny_address_id,
                      company_id : payloadData.company_id 
                    };
                    let save_answers = await DAO.saveData(Models.polls_answers,save_values) ;
                  }
                };
          };
          /******  to edit specific poll by _id ******/
          let query = {
                _id : payloadData._id ,
                is_deleted : false
          };
          let update_poll_data = await DAO.findAndUpdate(Models.polls,query,data_to_add,{ new : true }) ;
          
          /*** to add members in polls ***/
          if(payloadData.members){
                // /** remove existing members ***/
                // let remove_old_members = await DAO.remove(Models.polls_members,{poll_id : payloadData._id});
                
                let total_member = payloadData.members ;
                total_member.push({ member_id: userData._id})
                for(let data of total_member){
                      let insert_data = {
                            poll_id : payloadData._id,
                            member_id : data.member_id,
                            compny_address_id : payloadData.compny_address_id,
                            company_id : payloadData.company_id 
                      };
                      let save_poll_members = await DAO.saveData(Models.polls_members,insert_data) ;
                      let send_noti_of_poll = await notificationController.send_poll_noti(insert_data,userData._id)
                }; 
          };  
          return update_poll_data ;
    }else{
          let save_poll_data = await DAO.saveData(Models.polls,data_to_add) ;
          // console.log("------save_poll_data ------",save_poll_data) ;
          /** to save multiple answers */
          if(payloadData.answer_name){
            let total_answers = payloadData.answer_name ;
            for(let ans of total_answers){
              let save_values = {
                poll_id : save_poll_data._id,
                answer : ans.answer,
                compny_address_id : payloadData.compny_address_id,
                company_id : payloadData.company_id 
              };
              let save_answers = await DAO.saveData(Models.polls_answers,save_values) ;
            };
          };
          /*** to add members in polls ***/
          if(payloadData.members){
            let total_member = payloadData.members ;
            // console.log("total_member in polls",total_member) ;
            total_member.push({ member_id: userData._id})
            for(let data of total_member){
              let insert_data = {
                poll_id : save_poll_data._id,
                member_id : data.member_id,
                compny_address_id : payloadData.compny_address_id,
                company_id : payloadData.company_id 
              };
              let save_poll_members = await DAO.saveData(Models.polls_members,insert_data) ;
              let send_noti_of_poll = await notificationController.send_poll_noti(insert_data,userData._id);
            }; 
          };  
          return save_poll_data ;
      };
  }catch(err){
    throw err ;
  };
};

const complete_past_polls = async() => {
  try{
    let current_time = moment().startOf("day").format('x') ;
    let Model = Models.polls ;
    let query = {
      is_deleted : false,
      status : "upcoming",
      end_date : {$lt : current_time },
    };
    let update = { status : "completed" }
    
    await DAO.updateMany(Model,query,update,{new : true}) ;
  }catch(err){
    throw err ;
  };
};

const list_polls = async(payloadData,userData) => {
  try{
    let complete_pending_data = await complete_past_polls() ;
    let userBlock = [] ;
    let fetch_blocked_users = await commonController.blocked_users_list(userData)  ;
    let fetch_member_query ;
    let poll_array = [] ;
    let query ;
    if(fetch_blocked_users.length != 0){
      for(let userBlocked of fetch_blocked_users){
        userBlock.push(userBlocked.blocked_id) ;
      } ;
    };
    let query_for_members  ;
    let members = [] /* variable used for condition in fetching members*/
    let member_condition  = {
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      member_id : userData._id,
      is_deleted : false
    };
    let all_polls_assigned = await DAO.getData(Models.polls_members,member_condition,{__v : 0},{lean : true}) ;
    if(all_polls_assigned.length != 0){
      for(let poll of all_polls_assigned){
        poll_array.push(poll.poll_id) ;
      }
    }
    let conditions = { 
      _id : {$in : poll_array} ,
      status : payloadData.status ,
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      is_deleted : false
    };
    if(userBlock.length != 0){ conditions.user_id = {$nin : userBlock} ; }
    if(payloadData._id){
      conditions = {
        _id : payloadData._id,
        company_id : payloadData.company_id,
        compny_address_id : payloadData.compny_address_id,
        is_deleted : false
      };
      if(userBlock.length != 0){conditions.user_id = {$nin : userBlock} ;};
    }
    let populate  = [
      {
        path : "user_id",
        select : "_id isAvailable full_name profile_picture"
      },
      {
        path : "channel_id",
        select : "_id channel_name" 
      }
    ];
    let fetch_all_polls = await DAO.populateData(Models.polls,conditions,{__v : 0},{ lean : true },populate) ;
    /**fetch all the users blocked by me**/
    let fetch_users = await commonController.blocked_users_list(userData);
    // console.log("fetch Users in list polls---->>",fetch_users) ;
    if(fetch_all_polls.length != 0 ){
      for(let data of fetch_all_polls){
        if(fetch_users.length != 0){
          for(let userBlocked of fetch_users){
            members.push(userBlocked.blocked_id) 
          };
        }
        query_for_members = {
          company_id : payloadData.company_id,
          compny_address_id : payloadData.compny_address_id,
          poll_id : data._id,
          is_deleted : false
        };
        if(members.length != 0){ query_for_members.member_id = {$nin : members} } ;
        /**** fetch all the members added in poll ***/
        let populate_data = [
          {
            path :"member_id",
            select  :"_id full_name country_code contact_number profile_picture email"
          }
        ]
        let fetch_members = await DAO.getData(Models.polls_members,query_for_members,{__v : 0},{ lean : true }) ;
        let populate_fetch_members = await DAO.populate_Data(Models.polls_members,query_for_members,{__v : 0},{ lean : true },populate_data) ;
        if(fetch_members.length != 0){
          data.member_details = populate_fetch_members ;
          data.members = fetch_members.length  ;
        }else{
          data.member_details = [] ;
          data.members = 0 ;
        };
        let fetch_all_answers = await DAO.getData(Models.polls_answers,{ poll_id : data._id, is_deleted : false },{__v : 0},{ lean : true }) ;
        if(fetch_all_answers.length != 0) {
          /**** add all the answers related to poll ****/
          data.answer_name = fetch_all_answers ;
          /*** get total count of respond to every specific asnwer ***/
          for(let data1 of fetch_all_answers){
            let count_respond_to_answer = await DAO.getData(Models.polls_responses,{ answer_id : data1._id , poll_id : data1.poll_id ,is_deleted : false},{__v : 0},{lean : false}) ;
            let answer_responded = await DAO.getDataOne(Models.polls_responses,{ answer_id : data1._id , poll_id : data1.poll_id ,respond_by : userData._id,is_deleted : false},{__v : 0},{lean : false}) ;
            if(answer_responded != null){
              if(answer_responded.answer_respond == true){
                data.is_responsed = true  ;
              }else{
                data.is_responsed = false  ;
              };
            }
            data1.answer_respond_details = count_respond_to_answer ;
            if(count_respond_to_answer.length != 0 || count_respond_to_answer != null || count_respond_to_answer != undefined){
              data1.respond_count  =  count_respond_to_answer.length ;
            }else{
              data1.respond_count = 0 ;
            };  
          };
        }else{
          data.answer_name = [] ;
        };
      };
    };
    return fetch_all_polls ;
  }catch(err){
    throw err ;
  };
};

const delete_polls = async(payloadData,userData) => {
  try{
        let condtion = {
          user_id : userData._id,
          _id : payloadData._id,
        };
        let update_data = {} ;
        if(payloadData.is_deleted == true || payloadData.is_deleted == false){
          update_data.is_deleted = payloadData.is_deleted ;
        };
        let return_updated_data = await DAO.findAndUpdate(Models.polls,condtion,update_data,{ new : true });
        if(return_updated_data){
            let query = {
              poll_id : return_updated_data._id
            };
            /*** remove members of the poll ***/
            let remove_poll_members = await DAO.updateMany(Models.polls_members,query,{is_deleted : true },{ new : true } );
        };
        return return_updated_data ;
  }catch(err){
        throw err ;
  };
};

const add_respond_to_polls = async(payloadData,userData) => {
  try{
    let add_values = {
      poll_id : payloadData.poll_id,
      answer_id : payloadData.answer_id,
      respond_by : payloadData.respond_by,
      answer_respond : payloadData.answer_respond
    };
    let save_values = await DAO.saveData(Models.polls_responses,add_values) ;
    return save_values ;
  }catch(err){
    throw err ;
  };
};

const list_answers_respond = async(payloadData,userData) =>{
  try{
        let query ;
        /**fetch all the users blocked by me**/
        let fetch_users = await commonController.blocked_users_list(userData);
        if(fetch_users.length != 0){
              for(let user of fetch_users){
                    query = {
                          respond_by : {$nin : user.blocked_id},
                          answer_id : payloadData.answer_id,
                          poll_id : payloadData.poll_id,
                          is_deleted : false
                    };
              };
              console.log("if condition in list_answers_respond")
        }else{
              query = {
                    answer_id : payloadData.answer_id,
                    poll_id : payloadData.poll_id,
                    is_deleted : false
              };
              console.log("else condition in list_answers_respond")
        };
        let populate = [
              {
                    path : "respond_by",
                    select : "_id full_name email profile_picture isAvailable"
              }
        ]
        let number = 0;
        if(payloadData.pageNumber){
              number = payloadData.pageNumber ;
        };
        let fetch_all_data = await DAO.populateDataUser(Models.polls_responses,query,{ __v : 0 },{ lean : true },populate,number);
        return fetch_all_data ;
  }catch(err){
    throw err ;
  };
};

const vendor_list_channels = async(payloadData,userData) => {
  try{
    // console.log("payloadData ------",payloadData) ;
    let conditions = { is_deleted : false } ;
    if(payloadData.company_id){ conditions.company_id = payloadData.company_id ; };
    if(payloadData.selectType == "All"){
      let fetch_channels = await DAO.getData(Models.company_channels,conditions,{__v : 0},{lean : true}) ;
      console.log("fetch_channels ------->>>>",fetch_channels) ;
      // console.log("fetch_channels  in channel------",fetch_channels) ;
      if(fetch_channels.length != 0){
        for(let mem of fetch_channels){
          let fetch_member_coutn = await DAO.getData( Models.channel_members,{company_channels_id : mem._id,is_deleted : false },{_id : 1},{lean : true}) ;
          if(fetch_member_coutn.length != 0){
            let total_count = fetch_member_coutn.length  ;
            mem.count = total_count ;
            mem.unread_message = 0 ;
          }else{
            mem.count = 0 ;
            mem.unread_message = 0 ;
          }
        }
      }
      // console.log("fetch_channels  after members------",fetch_channels) ;
      return fetch_channels ;
    };
    if(payloadData.compny_address_id){  conditions.compny_address_id = payloadData.compny_address_id ;};
    let fetch_all_channels = await DAO.getData(Models.company_channels,conditions,{__v : 0},{lean : true}) ;
    // console.log("fetch_all_channels  in  else------",fetch_all_channels) ;
    if(fetch_all_channels.length != 0){
      for(let member of fetch_all_channels){
        let fecth_member_count = await DAO.getData(Models.channel_members,{company_channels_id : member._id,is_deleted : false },{_id : 1},{lean : true}) ;
        // console.log("fecth_member_count------",fecth_member_count) ;
        // console.log("fecth_member_count length------",fecth_member_count.length) ;
        if(fecth_member_count.length != 0){
          let total_coutn = fecth_member_count.length ;
          member.count = total_coutn ;
          member.unread_message = 0 ;
        }else{
          member.count = 0 ;
          member.unread_message = 0 ;
        }
      }
    };
    // console.log("fetch_channels  after members------",fetch_all_channels) ;
    return fetch_all_channels ;
  }catch(err){
    throw err ;
  };
};


const list_status = async(payloadData,userData) => {
  try{
    let fetch_all_data = await DAO.getData(Models.status,{is_deleted : false},{__v : 0}, { lean : true }) ;
    return fetch_all_data ;
  }catch(err){
    throw err ;
  };
};

const edit_profile = async(payloadData,userData) => {
  try{
    console.log("payload data ------->>>>>",payloadData) ;
    let query = {  _id : userData._id } ;
    
    let data_to_update = {};
    if(payloadData.profile_picture){ data_to_update.profile_picture = payloadData.profile_picture } ;
    if(payloadData.full_name){ data_to_update.full_name = payloadData.full_name } ;
    if(payloadData.department_id){ data_to_update.department_id = payloadData.department_id } ;
    if(payloadData.dob){ 
      data_to_update.dob = payloadData.dob ;
      let date_month = payloadData.dob.split("/") ;


      data_to_update.date_and_month = date_month[0] + "/" + date_month[1];
     } ;
    if(payloadData.status){ data_to_update.status = payloadData.status } ;
    //   ##### checking email exists in DB
    if (payloadData.email){
          let email = payloadData.email.toLowerCase();
          let condition = {
                _id: userData._id,
                email: email,
          };
          let check_user_mail = await DAO.getData(Models.users,condition,{ __v: 0 }, { lean: true } );
          if (check_user_mail.length != 0) {
                data_to_update.email = payloadData.email.toLowerCase();
          }else{
                let check_email = await commonController.check_user_email(email);
                if (check_email.length) {
                      throw ERROR.EMAIL_ALREADY_EXIST;
                };
                data_to_update.email = payloadData.email.toLowerCase();
          };
    };
    //   ##### checking payloadData.contactNumber exists in DB
    if (payloadData.contact_number) {
          let contactNumber = payloadData.contact_number;
          let condition = {
                _id: userData._id,
                contact_number: contactNumber,
          };
          let check_user_number = await DAO.getData( Models.users,condition,{ __v: 0 },{ lean: true } ); 
          if (check_user_number.length != 0) {
                data_to_update.contact_number = contactNumber;
          }else{
                let checkPhunNum = await commonController.check_mobileNumber(contactNumber);
                if (checkPhunNum.length) {
                      throw ERROR.MOBILE_ALREADY_EXIST;
                };
                data_to_update.contact_number = contactNumber;
          };
    };
    let update_user_profile = await DAO.findAndUpdate(Models.users,query,data_to_update,{ new : true }) ;
    return update_user_profile ; 
  }catch(err){
    throw err ;
  };
};

const delete_user_channels = async(payloadData,userData)=> {
  try{
    let query = {
      member_id : userData._id,
      company_channels_id : payloadData._id,
      is_admin : true,
      is_deleted : false
    } ;
    let chcek_user_if_admin = await DAO.getData(Models.channel_members,query,{__v : 0},{lean : true}) ;
    if(chcek_user_if_admin.length != 0){
      let query_to_delete_cahnnel = {
        _id :  payloadData._id,  
      }
      let updated_daata = {} ;
      if(payloadData.is_deleted === true || payloadData.is_deleted === false){
        updated_daata.is_deleted = payloadData.is_deleted ;
      };
      delete_channels = await DAO.findAndUpdate(Models.company_channels,query_to_delete_cahnnel,updated_daata,{new : true}) ;
      return delete_channels ;
    }else{
      throw ERROR.NOT_ADMIN ;
    }
    // var delete_channels = {} ;
    // /** fetch all the channels of user ****/
    // let fetch_all_data = await DAO.getData(Models.company_channels,query,{_id : 1},{ lean : true }) ;
    // if(fetch_all_data.length != 0){
    //   for(let data of fetch_all_data){
    //     let conditions = {
    //       _id : data._id,
    //       user_id : userData._id,
    //       is_deleted : false
    //     };
    //     let updated_daata = {};
    //     if(payloadData.is_deleted === true || payloadData.is_deleted === false){
    //       updated_daata.is_deleted = payloadData.is_deleted ;
    //     };
    //     delete_channels = await DAO.findAndUpdate(Models.company_channels,conditions,updated_daata,{new : true}) ;
    //     /**** delete all the members of the channel ****/
    //     let delete_channels_members = await DAO.updateMany(Models.channel_members,{company_channels_id : data._id,is_deleted : false},{is_deleted : true},{new  : true}) ;
    //   };
    //   return delete_channels ;
    // };
  }catch(err){
    throw err ;
  };
};

const list_about_us = async() => {
      try{
            let fetch_about_us = await DAO.getDataOne(Models.about_us ,{is_deleted : false},{__v : 0},{lean : true}) ;
            return fetch_about_us ;
      }catch(err){
            throw err ;
      };
};

const list_policies = async() => {
      try{
            let fetch_policies = await DAO.getDataOne(Models.privacy_policies,{is_deleted : false},{__v : 0},{ lean : true } ) ;
            return fetch_policies ;
      }catch(err){
            throw err ;
      };
};

const list_terms = async() => {
      try{
            let fetch_terms = await DAO.getDataOne(Models.terms_conditions,{is_deleted : false},{__v : 0},{lean  : true}) ;
            return  fetch_terms ;
      }catch(err){
            throw err ;
      };
};

const create_qr_code = async(userData)=>{
  try{
              let data  = JSON.stringify({
                    user_id : userData._id,
              });
              let imgData = QR.drawImg(data, {
                    typeNumber: 4,
                    errorCorrectLevel: 'M',
                    size: 500
              })

              let date = new Date(Date.now()).getTime()

              let base64value = Buffer.from(imgData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
              console.log("base64", base64value)
              let file_name = date.toString() + ".jpg"
              let upload_data = {
                    Bucket: aws3.bucket,
                    Key: file_name,
                    Body: base64value,
                    ContentType: "image/jpg"
              }
              let file = await commonController.uploadQrCode(upload_data)
              console.log("....file....", file)
              return file

      }catch(err){
            throw err ;
      };
    };

const block_users = async(payloadData,userData) => {
  try{
    // console.log("payloadData in block_users ------->>>>>",payloadData) ;
    var data_to_save = {
      user_id : userData._id, 
      blocked_id : payloadData.blocked_id
    };
    if(payloadData.is_blocked === true ||payloadData.is_blocked === false ){
      data_to_save.is_blocked =  payloadData.is_blocked
    };
    if(payloadData.blocked_id) {
      let blockId = payloadData.blocked_id ;
      /*** chcek if user is already blocked or not ***/
      let chcek_if_exists  = await commonController.chck_if_user_exists(userData._id,blockId) ;
      if(chcek_if_exists.length != 0){
        /*** if found data ****/
        let query = {
          user_id : userData._id,
          blocked_id : payloadData.blocked_id ,
          is_deleted : false
        };
        let update_data = await DAO.findAndUpdate(Models.blocked_users,query,data_to_save,{new : true}) ;
        // console.log("update_data in block_users ------->>>>>",update_data) ;
        return update_data ;
      }else{
        /*** if user has not being blocked ****/
        let save_data = await DAO.saveData(Models.blocked_users,data_to_save) ;
        // console.log("save_data in block_users ------->>>>>",save_data) ;
        return save_data ;
      };
    };
  }catch(err){
    throw err ;
  };
};

var list_blocked_users = async(payloadData,userData) => {
      try{
            let query = {
              user_id : userData._id,
              is_deleted : false,
              is_blocked : true,
            };
            let populate = [
                  {
                        path : "user_id",
                        select : "_id full_name email profile_picture isAvailable",
                  },
                  {
                        path : "blocked_id",
                        select : "_id full_name email profile_picture isAvailable",
                  },
            ];
            var pages = 0 ;
            if(payloadData.pageNumber){
              pages = payloadData.pageNumber ;
            };
            
            let list_all_users  = await DAO.getData(Models.blocked_users,query,{_id : 1},{lean : true}) ;
            let fetch_populated_data = await DAO.populateDataUser(Models.blocked_users,query,{__v : 0},{lean : true},populate,pages) ;
            return {
                  Count : list_all_users.length /*** length of bloked useers */,
                  fetch_populated_data 
            };
      }catch(err){
            throw err ;
      };
};

const add_edit_meeting = async(payloadData,userData) => {
  try{
    let Model = Models.meetings ;
    let data_to_handle  = {  user_id : userData._id } ;
    if(payloadData.company_id){ data_to_handle.company_id = payloadData.company_id };
    if(payloadData.compny_address_id){ data_to_handle.compny_address_id = payloadData.compny_address_id };
    if(payloadData.channel_id){ data_to_handle.channel_id = payloadData.channel_id };
    if(payloadData.time_zone){data_to_handle.time_zone  = payloadData.time_zone } ;
    if(payloadData.title){data_to_handle.title  = payloadData.title } ;
    if(payloadData.description){data_to_handle.description = payloadData.description};
    if(payloadData.start_date){
      data_to_handle.start_date_in_string = payloadData.start_date ;
      let dates = payloadData.start_date ;
      let date_in_milli = moment(dates,"YYYY/MM/DD").format('x') ;
      data_to_handle.start_date = date_in_milli ;
    };  
    if(payloadData.end_date){
      data_to_handle.end_date_in_string =  payloadData.end_date ;
      let date1 = payloadData.end_date ;
      let date_in_milli = moment(date1,"YYYY/MM/DD").format('x') ;
      data_to_handle.end_date = date_in_milli  ;
    };
    if(payloadData.start_time){
      let time_in_minutes  = await commonController.managed_timing(payloadData.start_time) ;
      data_to_handle.start_time = time_in_minutes ;
    };
    if(payloadData.end_time){
      let time_in_minutes  = await commonController.managed_timing(payloadData.end_time) ;
      data_to_handle.end_time =  time_in_minutes ;
    };
    if(payloadData.call_link){data_to_handle.call_link = payloadData.call_link} ;

    /*** to edit specific meeting by _id ***/
    if(payloadData._id){
      if(payloadData.member_id){
            /***** remove existing meeeting members *****/
            // let remove_old_members = await DAO.remove(Models.meeting_members,{meeting_id : payloadData._id}) ;
            /*** add new members ***/
            let members = payloadData.member_id ;
            members.push(userData._id);
            for(let data of members){
              let new_members = {
                meeting_id : payloadData._id,
                member_id : data,
                company_id :payloadData.company_id,
                compny_address_id : payloadData.compny_address_id 
              };
              let saved_members = await DAO.saveData(Models.meeting_members,new_members) ;
              let metting_noti = await notificationController.meet_invite_notification(new_members,userData._id) ;
            } ;
      };
      let query = {
        _id : payloadData._id,
        is_deleted : false
      };
      let return_updated_data = await Model.findOneAndUpdate(query,data_to_handle,{ new : true });
      
      return return_updated_data ;
    }else{
          /*** to save new data ***/
          let save_data = await Model.create(data_to_handle) ;
          /*** save meeting members *****/
          if(payloadData.member_id){
           
                let members = payloadData.member_id ;
                members.push(userData._id);
                // console.log("members --------",members) ;
                for(let data of members){
                      let insert_data = {
                            meeting_id : save_data._id,
                            member_id : data,
                            company_id :payloadData.company_id,
                            compny_address_id : payloadData.compny_address_id 
                      };
                      let save_members = await DAO.saveData(Models.meeting_members,insert_data) ;
                      let metting_noti = await notificationController.meet_invite_notification(insert_data,userData._id) ;
                } ;
          };
          return save_data ;
    };
  }catch(err){
    throw err ;
  };
};

const fetch_upcoming_meetings = async() =>{
  try{
    let query = {
      is_deleted : false,
      status : "upcoming"
    };
    let get_data = await DAO.getData(Models.meetings,query,{__v : 0},{lean : true}) ;
    return get_data  ;
  }catch(err){
    throw err ;
  }
};

const list_all_meetings = async(payloadData,userData) => {
  try{
    // let all_meeting = await fetch_upcoming_meetings() ;
    // if(all_meeting.length != 0){
    //   for(let meet of all_meeting){
    //     let timeZone = meet.time_zone ;
    //     let current_time = moment().tz(timeZone).format("HH:mm");
    //     let hours_minutes = await commonController.managed_timing(current_time) ;
    //     let current_date_string = moment().tz(timeZone).format('YYYY/MM/DD') ;
    //     if(meet.end_time < hours_minutes && meet.end_date_in_string  == current_date_string){
    //       let query = {
    //         _id : meet._id,
    //         is_deleted : false,
    //         end_date_in_string : current_date_string,
    //         end_time  :{ $lt : hours_minutes }
    //       };
    //       let data_for_update = { status : "completed" } ;
    //       let update_db = await DAO.updateMany(Models.meetings,query,data_for_update,{new : true }) ;
    //       return update_db ;
    //     };
    //   }
    // };
    let blockArray = [] ;
    let userBlock = [] ;
    let meet_member_array = [] ; 
    let fetch_blocked_users = await commonController.blocked_users_list(userData)  ;
    let fetch_member_query ;
    let query ;
    if(fetch_blocked_users.length != 0){
      for(let userBlocked of fetch_blocked_users){
        userBlock.push(userBlocked.blocked_id) ;
      } ;
    };    
    let fetch_assigned_meet = await commonController.fetch_meet_members(payloadData,userData) ;
    query = {
      _id : {$in : fetch_assigned_meet} ,
      status : payloadData.status,
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      is_deleted : false
    };
    if(userBlock.length != 0){
      query.user_id = {$nin : userBlock} 
    };
    if(payloadData._id){
      query = {
        _id : payloadData._id,
        status : payloadData.status,
        company_id : payloadData.company_id,
        compny_address_id : payloadData.compny_address_id,
        is_deleted : false
      };
      if(userBlock.length != 0){ query.user_id = {$nin : userBlock} };
    } ;
    let populate = [
      {
        path : "user_id",
        select : "_id full_name profile_picture isAvailable"
      },
      {
        path : "channel_id",
        select : "_id channel_name" 
      }
    ]
    let pages = 0 ;
    if(payloadData.pageNumber){
      pages = payloadData.pageNumber ;
    };
    let fetch_all_blocked_users = await commonController.blocked_users_list(userData) ;
    let fetch_all_meetings = await DAO.populateDataUser(Models.meetings,query,{__v : 0},{lean : true},populate,pages) ;
    if(fetch_all_meetings.length != 0){
      for(let data of fetch_all_meetings){
        /*** fetching all the users blocked by me ****/
        if(fetch_all_blocked_users.length != 0){
          for(let userBlocked of fetch_all_blocked_users){
            blockArray.push(userBlocked.blocked_id) ;
          } ;
        };
        fetch_member_query = {
          company_id : payloadData.company_id,
          compny_address_id : payloadData.compny_address_id,
          meeting_id : data._id,     
        }; 
        if(blockArray.length != 0){
          fetch_member_query.member_id = { $nin : blockArray }
        }
        let populate_data = [
          {
            path : "member_id",
            select  :"_id full_name country_code contact_number profile_picture email"
          }
        ]
        let fetch_meeting_members = await DAO.getData(Models.meeting_members,fetch_member_query,{__v : 0},{lean : true}) ;
        let populate_fetch_meeting_members = await DAO.populate_Data(Models.meeting_members,fetch_member_query,{__v : 0},{lean : true},populate_data) ;
        if(fetch_meeting_members.length != 0){
          data.member_details = populate_fetch_meeting_members ;
          data.participents = fetch_meeting_members.length ;
        }else{
          data.member_details = [] ;
          data.participents = 0; 
        };
      };
    };
    return fetch_all_meetings ;
  }catch(err){
    throw err ;
  }
};

const list_meeting_members = async(payloadData,userData) => {
  try{
        let query_for_members ;
        let query = {
              _id : payloadData._id,
              is_deleted : false
        };
        let populate = [
              {
                    path : "user_id",
                    select : "_id full_name isAvailable profile_picture contact_number email"
              }
        ];
        let fetch_meeting_data = await DAO.populate_Data(Models.meetings,query,{__v : 0},{lean : true},populate);
        if(fetch_meeting_data.length != 0 ){
              for(let data of fetch_meeting_data){
                    let populated = [
                          {
                                path : "member_id",
                                select : "_id full_name isAvailable profile_picture contact_number email"
                          }
                    ]
                    let fetch_all_blocked_users = await commonController.blocked_users_list(userData) ;
                    if(fetch_all_blocked_users.length != 0){
                          for(let data3 of fetch_all_blocked_users){
                                query_for_members  = {
                                      member_id : {$nin : [data3.blocked_id]},
                                      meeting_id : data._id
                                };
                                console.log("if condition in list_meeting_members ") ;    
                          };
                    }else{
                          console.log("else condition in list_meeting_members ") ;  
                          query_for_members  = { meeting_id : data._id };  
                    }
                    let fetch_members = await DAO.populate_Data(Models.meeting_members,query_for_members,{__v: 0},{lean : true },populated) ;
                    data.members = fetch_members ;
              };    
        };
        return fetch_meeting_data ; 
  }catch(err){
        throw err ;
  }
};

const delete_meeting = async(payloadData,userData) => {
  try{
    let conditions = { _id : payloadData._id  };
    let data = {} ;
    if(payloadData.is_deleted === true || payloadData.is_deleted === false){
      data.is_deleted = payloadData.is_deleted ;
    };
    let updated_data  = await DAO.findAndUpdate(Models.meetings,conditions,data,{new : true }) ;
    if(updated_data){
      let delete_members = await DAO.remove(Models.meeting_members, {meeting_id: payloadData._id}) ;     
    };
    return updated_data ;
  }catch(error){
    throw error ;
  };
};

const search_data = async(payloadData,userData) => {
  try{
    let searchData = [] ;
    if(payloadData.search_type == "All"){
      /**fetch all the user data searched */
      let get_users = await commonController.get_searched_users(payloadData,userData) ;
      if(get_users.length != 0){
        console.log("user is searching") ;
        for(let data_of_user of get_users){
          searchData.push(data_of_user) ;
        };
      };
      /**ftech all channels**/
      let get_channels = await commonController.get_searched_channels(payloadData,userData) ;
      if(get_channels.length != 0){
        console.log("channels is searching") ;
        for(let dataOfChannel of get_channels){
          searchData.push(dataOfChannel) ;
        };
      };
      /**fetch all meeting */
      let fetch_meetings = await commonController.get_meeting_data(payloadData,userData) ;
      if(fetch_meetings.length != 0){
        console.log("meeting is searching") ;
        for(let dataOfMeeting of fetch_meetings){
          searchData.push(dataOfMeeting) ;
        };
      };
      /**fetch polls */
      let fetch_poll = await commonController.get_poll_data(payloadData,userData) ;
      if(fetch_poll.length != 0){
        console.log("poll is searching") ;
        for(let dataOfPoll of fetch_poll){
          searchData.push(dataOfPoll) ;
        };
      };
      /**fetch tasks */
      let ftech_task = await commonController.fetch_all_tasks(payloadData,userData) ;
      if(ftech_task.length != 0){
        for(let dataOfTask of ftech_task){
          searchData.push(dataOfTask) ;
        };
      };

      return searchData ;
    };
    if(payloadData.search_type == "Contact"){
      let get_users = await commonController.get_searched_users(payloadData,userData) ;
      if(get_users.length != 0){
        for(let data_of_user of get_users){
          searchData.push(data_of_user) ;
        };
      };
      return searchData ; 
    };
    if(payloadData.search_type == "Channel"){
      let get_channels = await commonController.get_searched_channels(payloadData,userData) ;
      if(get_channels.length != 0){
        for(let dataOfChannel of get_channels){
          searchData.push(dataOfChannel) ;
        };
      };
      return searchData ; 
    };
    if(payloadData.search_type == "Polls"){
      let fetch_poll = await commonController.get_poll_data(payloadData,userData) ;
      if(fetch_poll.length != 0){
        for(let dataOfPoll of fetch_poll){
          searchData.push(dataOfPoll) ;
        };
      };
      return searchData ; 
    }
    if(payloadData.search_type == "Meeting"){
      let fetch_meetings = await commonController.get_meeting_data(payloadData,userData) ;
      if(fetch_meetings.length != 0){
        for(let dataOfMeeting of fetch_meetings){
          searchData.push(dataOfMeeting) ;
        };
      };
      return searchData ; 
    }
    if(payloadData.search_type == "Task"){
      let ftech_task = await commonController.fetch_all_tasks(payloadData,userData) ;
      if(ftech_task.length != 0){
        for(let dataOfTask of ftech_task){
          searchData.push(dataOfTask) ;
        };
      };
      return searchData ; 
    }

   
  }catch(err){
    throw err ;
  }
}

const add_edit_ques_ans = async(payloadData,userData) =>{ 
  try{
    let Model = Models.ques_ans ;
    let current_date = moment().format("x") ;
    let data_to_save = {  date : current_date, user_id : userData._id }; 
    // if(payloadData.question){ data_to_save.question =  payloadData.question };
    let ques = payloadData.question ;
    if(ques.length != 0 ){
      for(let q of ques){
        if(payloadData._id){
          let condition = {
            _id : payloadData._id,
            is_deleted : false
          };
          data_to_save.question = q ; 
          let update_ques_ans = await Model.findOneAndUpdate(condition,data_to_save,{new : true }) ;
          // return update_ques_ans ;
        }else{
          data_to_save.question = q ; 
          let save_ques_ans = await Model.create(data_to_save) ;
          // return save_ques_ans ;
        };
      };
    };
  }catch(err){
    throw err ;
  };
};

const list_ques_ans = async(payloadData,userData) => {
  try{
    let Model = Models.ques_ans ;
    let condition = {
      user_id  : userData._id,
      is_deleted : false
    };
    if(payloadData._id){
      condition = {  user_id  : userData._id, _id : payloadData._id, is_deleted : false };
    };
    let skip_data = 0 ;
    if(payloadData.skip_page){
      skip_data = payloadData.skip_page ;
    }
    let fetch_all_ques_count = await DAO.getData(Model,{user_id  : userData._id, is_deleted : false},{__v : 0},{lean: true}) ;
    let fetch_all_ques = await DAO.getDataUser(Model,condition,{__v : 0},{lean: true},skip_data) ;
    return {
      Count : fetch_all_ques_count.length ,
      fetch_all_ques
    };
  }catch(err){
    throw err ;
  };
};

const delete_ques_ans = async(payloadData,userData) => {
  try{
    console.log("payloadData in delete_ques_ans ---->>>",payloadData) ;
    let Model = Models.ques_ans ;
    let ids = payloadData._id ;
    // console.log("ids-------",ids) ;
    if(ids.length != 0){
      for(let id of ids) {
        console.log("idi n delete_ques_ans---->>>",id) ;
        let query_for_delete = {
          _id : id,
          user_id : userData._id
        } ;
        let data = {} ;
        if(payloadData.is_deleted === true || payloadData.is_deleted === false){
          data.is_deleted = payloadData.is_deleted ;
        };
        let delete_quess = await DAO.findAndUpdate(Model,query_for_delete,data,{new : true }) ;
        console.log("delete_quess----->>>",delete_quess) ;
        if(delete_quess){
          let update_member_data = {
            ques_ans_id : id,
          }
          let delete_members = await DAO.updateMany(Models.ques_ans_members,update_member_data,{is_deleted : true},{new : true }) ;
        }
      };
    };
    return {"Message":"data deleted !"};
  }catch(err){
    throw err ;
  };
};

const assign_ques_ans = async(payloadData,userData) => {
  try{
    let finalData = [] ;
    let Model = Models.ques_ans_members ;
    if(payloadData.ques_id){
      let ques = payloadData.ques_id ;
      let member = payloadData.member_id ;
      
      for(let q of ques){
        for(let m of member) {
          let save_data = {
            ques_ans_id : q ,
            member_id : m,
          };
          let assign_ques = await DAO.saveData(Model,save_data) ;
          finalData.push(assign_ques) ;
        };
        for(let members of member){
          let qa_assigned_noti = await notificationController.ques_ans_assigned_noti(members,userData._id)
        };
      }
    }
    return finalData ;
  }catch(err){
    throw err ;
  };
};

const unassign_qa_from_user = async(payloadData,userData) => {
  try{
    console.log("payloadData in unassign_qa_from_user ---->>>>>",payloadData) ;
    let Model = Models.ques_ans_members ;
    let condtion = {
      ques_ans_id : payloadData.ques_id ,
      member_id : payloadData.member_id,
    };
    let update =  {} ;
    if(payloadData.is_deleted == true || payloadData.is_deleted == false ){
      update.is_deleted = payloadData.is_deleted  ;
    };
    let unassign_qa = await DAO.findAndUpdate(Model,condtion,update,{new : true }) ;
    console.log("unassign_qa in unassign_qa_from_user ---->>>>>",unassign_qa) ;
    return unassign_qa ;
  }catch(err){
    throw err ;
  }
}

const respond_to_ques_ans = async(payloadData,userData) => {
  try{
    console.log("payloadData in respond_to_ques_ans ---->>>",payloadData)  ;
    console.log("userData ===-==>>>",userData._id) ;
    let Model = Models.ques_ans_members ;
    let current_time = moment().format("x") ;
    let ques = payloadData.all_data ;
    if(ques.length != 0){
      for(let q of ques){
        console.log("q  ----------",q );
        let query = {
          ques_ans_id : q.ques_ans_id,
          member_id : userData._id
        };
        let data_to_update = {
          date : current_time,
          is_responded : true,
          respond : q.respond
        };
        let udpate_response = await DAO.findAndUpdate(Model,query,data_to_update,{new : true }) ;
        console.log("udpate_response  ..............",udpate_response) ;
      }
    }
  }catch(err){
    throw err ;
  };
};

const list_ques_ans_user_side = async(payloadData,userData) => {
  try{
    let Model = Models.ques_ans_members ;
    let condition = {
      member_id  : userData._id,
      is_deleted : false
    };
    let populate = [
      {
        path : "ques_ans_id",
        select  :"_id question"
      }
    ]
    let fetch_all_ques = await DAO.populate_Data(Model,condition,{__v : 0},{lean: true},populate) ;
    return fetch_all_ques ;
  }catch(err){
    throw err ;
  };
};

const list_ques_ans_respond_by_member = async(payloadData,userData) =>{ 
  try{
    let Model = Models.ques_ans_members ;
    let query = {
      member_id : payloadData.member_id,
      is_deleted : false 
    };
    let populate = [
      {
        path :"ques_ans_id",
        select  : "_id question user_id"
      },
      {
        path : "member_id",
        select : "_id isAvailable full_name"
      }
    ]
    let fetch_all_data = await DAO.populate_Data(Model,query,{__v : 0},{lean : true},populate) ;
    return fetch_all_data ;
  }catch(err){
    throw err ;
  };
};

const list_all_ques_responded_with_count = async(payloadData,userData) => {
  try{
    let Model = Models.ques_ans ;
    let memberArray  = [] ;
    let query = {
      user_id : userData._id,
      is_deleted : false
    };
    let ftech_all_questions = await DAO.getData(Model,query,{__v  : 0},{lean : true}) ;
   
    if(ftech_all_questions.length != 0){
      let ques_ids = [] ;
      let member_array = [] ;
      for(let ques of ftech_all_questions){
        ques_ids.push(ques._id) 
      }
      // console.log("ques_ids =------",ques_ids) ;
      
      let get_members_id = await DAO.getData(Models.users,{company_id : payloadData.company_id, compny_address_id : payloadData.compny_address_id},{_id : 1},{lean : true}) ;
      if(get_members_id.length != 0){
        for(let membrs of get_members_id){
          member_array.push(membrs._id) ;
        }
      }
      let populate = [
        {
          path : "member_id",
          select : "_id full_name profile_picture email"
        }
      ]

        let fetch_members = await DAO.populate_Data(Models.ques_ans_members,{ques_ans_id : {$in : ques_ids}, member_id : {$in : member_array},is_deleted : false},{__v : 0},{lean :  true},populate) ;
        // console.log("fetch_members =------",fetch_members.length) ;
        for(let member of fetch_members){

          member.total_questions = 1
          member.total_attempt = 0
          if(member.is_responded){
            member.total_attempt += 1 
          }
      

          let already_exsist = false
          if(memberArray.length != 0){
            for(let data of memberArray){
              if(data.member_id._id.toString() == member.member_id._id.toString()  ){
                already_exsist = true
                data.total_questions += 1
                if(member.is_responded){
                     data.total_attempt += 1 
                }
                
              }

            }

          }
          if(already_exsist == false){
            memberArray.push(member) ;
          }
      };
      // console.log("memberArrays =------",memberArray) ;
      // let fetch_unasnwerd_questions = await DAO.getData(Models.ques_ans_members,{}
    }
    return memberArray ;
  }catch(err){
    throw err ;
  };
};

const get_all_question_count = async(payloadData,userData) => {
  try{
    let Model = Models.ques_ans ;
    let query = { user_id : userData._id,is_deleted : false } ;
    let fetch_all_ques = await DAO.getData(Model,query,{__v : 0 },{lean : true}) ;
    if(fetch_all_ques.length != 0){
      for(let data of fetch_all_ques){
        // console.log("data------",data) ;
        let fetch_ques_ans_responses = await DAO.getData(Models.ques_ans_members,{is_responded : true,ques_ans_id: data._id,is_deleted : false},{__v : 0},{lean : true});
        // console.log("fetch_ques_ans_responses------",fetch_ques_ans_responses) ;
        data.count = fetch_ques_ans_responses.length ;
      }
    };
    return fetch_all_ques ;
  }catch(err){
    throw err ;
  }
}
const delete_ques_respond = async(payloadData,userData) => {
  try{
    let Model = Models.ques_ans_members 
  }catch(err){
    throw err ;
  }
}
const filter_tasks = async(payloadData,userData) => {
  try{
    // console.log("payloadData    -----",payloadData) ;
    let filteredData = [] ;
    let tasks_data = [];
    let Model = Models.tasks ;
    let query = {
      company_id :  payloadData.company_id,
      compny_address_id :  payloadData.compny_address_id,
      is_deleted : false,
    };
    if(payloadData.start_date && payloadData.end_date){
      // console.log("payloadData.start_date",payloadData.start_date,payloadData.end_date);
      let start = payloadData.start_date ;
      let start_in_milli = moment(start,"YYYY/MM/DD").format('x');
      // console.log("start_in_milli ------",start_in_milli) ;
      let end = payloadData.end_date ;
      let end_in_milli = moment(end,"YYYY/MM/DD").format('x')
      query = {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        $and : [
          { start_date : { $gte : start_in_milli }},
          { end_date : { $lte : end_in_milli }},
        ],
        is_deleted : false,
      };
    };
    if(payloadData.department_id){
      let data= {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        is_deleted : false
      };
      let populate = [
        {
          path : "member_id",
          select : "_id department_id country_code contact_number",
          populate : [
            {
              path : "department_id",
              select :"_id name"
            }
          ]
        }
      ]
      let populate_data = await DAO.populate_Data(Models.tasks_members,data,{__v : 0},{lean : true},populate) ;
      for(let data1 of populate_data){
        // console.log("data1 ----",data1 );
        if(data1.member_id != null){
          if(data1.member_id.department_id != null || data1.member_id.department_id != undefined){
            console.log("if condtion  ----" );
          // }
          // else{
            console.log("esle condtion  ----" );
            if( payloadData.department_id.toString()  === data1.member_id.department_id._id.toString()){
              // console.log("payloadData.department_id ----",payloadData.department_id) ;
              // console.log("data1.member_id.department_id._id ----",data1.member_id.department_id._id) ;
              tasks_data.push(data1.task_id) ;
            } 
            // console.log("tasks_data  ------",tasks_data) ;
          };
        }
      };
    };
    if(tasks_data.length != 0){
      // console.log("tasks_data ----",tasks_data.length );
      query._id  = {$in : tasks_data} ;
    };
    // console.log("query in filter task  -===========",query);
    if(payloadData.title){
      query.title =  { $regex : payloadData.title,$options : "i" }  ;
    };
    // console.log("query outside -----",query) ;
    let get_filtered_data = await DAO.getData(Model,query,{__v : 0},{ lean : true });
  
    // console.log("get_filtered_data -------",get_filtered_data) ;
    if(get_filtered_data.length != 0){
      for(let data of get_filtered_data){
        let fetch_task_members = await commonController.populate_task_members(data);
        if(fetch_task_members.length != 0){
          data.member = fetch_task_members ;
        }
        filteredData.push(data)
      };
    }
    return filteredData  ;
  }catch(err){
    throw err ;
  }
};

const filter_polls = async(payloadData,userData) => {
  try{
    // console.log("payloadData  in filter-----",payloadData) ;
    let filteredData = [] ;
    let tasks_data = [];
    let Model = Models.polls ;
    let query = {
      company_id :  payloadData.company_id,
      compny_address_id :  payloadData.compny_address_id,
      is_deleted : false,
    };
    if(payloadData.start_date && payloadData.end_date){
      // console.log("payloadData.start_date",payloadData.start_date,payloadData.end_date);
      let start = payloadData.start_date ;
      let start_in_milli = moment(start,"YYYY/MM/DD").format('x');
      // console.log("start_in_milli ------",start_in_milli) ;
      let end = payloadData.end_date ;
      let end_in_milli = moment(end,"YYYY/MM/DD").format('x')
      query = {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        $and : [
          { start_date : { $gte : start_in_milli }},
          { end_date : { $lte : end_in_milli }},
        ],
        is_deleted : false,
      };
    };
    if(payloadData.department_id){
      let data= {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        is_deleted : false
      };
      let populate = [
        {
          path : "member_id",
          select : "_id department_id country_code contact_number",
          populate : [
            {
              path : "department_id",
              select :"_id name"
            }
          ]
        }
      ]
      let populate_data = await DAO.populate_Data(Models.polls_members,data,{__v : 0},{lean : true},populate) ;
      // console.log("populated data in task ------",populate_data) ;
   
      for(let data1 of populate_data){
        // console.log("data1 ----",data1 );
        if(data1.member_id != null){
          if(data1.member_id.department_id != null || data1.member_id.department_id != undefined){
            console.log("if condtion  ----" );
          // }
          // else{
            console.log("esle condtion  ----" );
            if( payloadData.department_id.toString()  === data1.member_id.department_id._id.toString()){
              // console.log("payloadData.department_id ----",payloadData.department_id) ;
              // console.log("data1.member_id.department_id._id ----",data1.member_id.department_id._id) ;
              tasks_data.push(data1.task_id) ;
            } 
            // console.log("tasks_data  ------",tasks_data) ;
          };
        }
      };
    };
    if(tasks_data.length != 0){
      // console.log("tasks_data ----",tasks_data.length );
      query._id  = {$in : tasks_data} ;
    };
    if(payloadData.question){
      query.question =  { $regex : payloadData.question,$options : "i" }  ;
    };
    let get_filtered_data = await DAO.getData(Model,query,{__v : 0},{lean : true });
    if(get_filtered_data.length != 0){
      for(let data of get_filtered_data){
        let fetch_details = await commonController.list_polls(data,userData) ;
        if(fetch_details.length != 0){
          for(let data1 of fetch_details){
            filteredData.push(data1)
          }
         
        }
        
      };
    }
    return filteredData  ;
  }catch(err){
    throw err ;
  };
};

const filter_meetings = async(payloadData,userData) => {
  try{
    // console.log("payloadData  in meetings -----",payloadData) ;
    let filteredData = [] ;
    let tasks_data = [];
    let Model = Models.meetings ;
    let query = {
      company_id :  payloadData.company_id,
      compny_address_id :  payloadData.compny_address_id,
      is_deleted : false,
    };
    if(payloadData.start_date && payloadData.end_date){
      // console.log("payloadData.start_date",payloadData.start_date,payloadData.end_date);
      let start = payloadData.start_date ;
      let start_in_milli = moment(start,"YYYY/MM/DD").format('x');
      // console.log("start_in_milli ------",start_in_milli) ;
      let end = payloadData.end_date ;
      let end_in_milli = moment(end,"YYYY/MM/DD").format('x')
      query = {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        $and : [
          { start_date : { $gte : start_in_milli }},
          { end_date : { $lte : end_in_milli }},
        ],
        is_deleted : false,
      };
    };
    if(payloadData.department_id){
      let data= {
        company_id :  payloadData.company_id,
        compny_address_id :  payloadData.compny_address_id,
        is_deleted : false
      };
      let populate = [
        {
          path : "member_id",
          select : "_id department_id country_code contact_number",
          populate : [
            {
              path : "department_id",
              select :"_id name"
            }
          ]
        }
      ]
      let populate_data = await DAO.populate_Data(Models.meeting_members,data,{__v : 0},{lean : true},populate) ;
      for(let data1 of populate_data){
        // console.log("data1 ----",data1 );
        if(data1.member_id != null){
          if(data1.member_id.department_id != null || data1.member_id.department_id != undefined){
            if( payloadData.department_id.toString()  === data1.member_id.department_id._id.toString()){
              tasks_data.push(data1.task_id) ;
            };
          };
        }
      };
    };
    if(payloadData.title){
      query.title =  { $regex : payloadData.title,$options : "i" }  ;
    };
    let populated_data = [
      {
        path :"user_id",
        select : "_id full_name country_code contact_number profile_picture"
      }
    ]
    let get_filtered_data = await DAO.populate_Data(Model,query,{__v : 0},{lean : true },populated_data);
    if(get_filtered_data.length != 0){
      for(let data of get_filtered_data){
        let meet_member_count = await DAO.getData(Models.meeting_members,{ meeting_id : data._id,is_deleted : false},{_id : 1},{lean : true}) ;
        let populate_data = [
          {
            path : "member_id",
            select  :"_id full_name country_code contact_number profile_picture email"
          }
        ]
        let populate_fetch_meeting_members = await DAO.populate_Data(Models.meeting_members,{ meeting_id : data._id,is_deleted : false},{__v : 0},{lean : true},populate_data) ;
        if(meet_member_count.length != 0){
          data.member_details = populate_fetch_meeting_members ;
          data.participents = populate_fetch_meeting_members.length ;
        }else{
          data.member_details = [];
          data.participents = 0;
        };
        filteredData.push(data)
      };
    };
    return filteredData  ;
  }catch(err){
    throw err ;
  };
};

const send_message = async(payloadData,userData) => {
  try{
    // console.log("payloadData data in 3461 line----->>>>",payloadData) ;
    // console.log("user data in 3462 line----->>>>",userData) ;
    let Model = Models.chats ;
    let current_time = moment().format('x') ;
    let data = {
      sender_id : userData._id,
      reciever_id :  payloadData.reciever_id,
      date : current_time,
      time : current_time,
      chat_format : "one-to-one"
    };
    if(payloadData.message){ data.message = payloadData.message };
    if(payloadData.company_id){ data.company_id = payloadData.company_id };
    if(payloadData.compny_address_id){ data.compny_address_id = payloadData.compny_address_id };
    if(payloadData.message_type){data.message_type = payloadData.message_type};
    let save_details = await DAO.saveData(Model,data) ;
    let send_chat_noti = await notificationController.send_chat_notification(payloadData.reciever_id,save_details._id,userData._id,payloadData.message) ;
    /* fetch last message to show on message listing */
    let query_data = {
      $or : [
        {
          $and : [
            { sender_id : userData._id },
            { reciever_id : payloadData.reciever_id },
          ]
        },
        {
          $and : [
            { sender_id :  payloadData.reciever_id },
            { reciever_id : userData._id },
          ]
        }
      ]
    };
    // console.log(" query_data -------",query_data) ;
    let fetch_last_message = await DAO.getData(Models.last_messages,query_data,{__v : 0},{lean : true}) ;

    if(fetch_last_message.length != 0){
      let update_last_message = await DAO.findAndUpdate(Models.last_messages,query_data,data,{new : true}) ;
      // console.log(" update_last_message -------",update_last_message) ;
    }else{
      let save_last_message = await DAO.saveData(Models.last_messages,data) ;
      // console.log(" save_last_message -------",save_last_message) ;
    };
    return save_details ;
  }catch(err){
    throw err ;
  };
};

const read_messages = async(payloadData,userData) => {
  try{
    // console.log("payloadData in read_messages --- ",payloadData) ;
    let Model = Models.chats ;
    if(payloadData.reciever_id){
      let query = {
        sender_id :  userData._id,
        reciever_id : payloadData.reciever_id,
        is_deleted : false
      };
      let read_message = await DAO.updateMany(Model,query,{is_read : true},{new : true }) ;
      let read_last_message = await DAO.findAndUpdate(Model,query,{is_read : true},{new : true } ) ;
      return read_message ;
    };
    if(payloadData.channel_id){
      let update  = { 
        "status_data.$.is_read" : true 
      } ;
        // console.log("update -----",update)
      let query = { 
        channel_id : payloadData.channel_id,
        'status_data.user_id' : userData._id
      };
      // console.log("query -----",query)
      let option = { new : true} ;
      let read_message = await DAO.updateMany(Models.chats,query ,update,option) ;
      // console.log("read_message --------",read_message) ;
      let read_last_message = await DAO.findAndUpdate(Models.last_messages,query,update,option)  ;
      return read_message ;
    };
  }catch(err){
    throw err ;
  };
};

const user_message_listing = async(payloadData,userData) => {
  try{


    if(payloadData.reciever_id){
      
                        let Model = Models.chats ;
                        let fetch_blocked_users = await commonController.blocked_users_list_in_chat(userData,payloadData.reciever_id) ;
                        // console.log("fetch_blocked_users =============",fetch_blocked_users) ;
                        if(fetch_blocked_users.length != 0){
                          throw ERROR.CANT_OPEN_CHAT ;
                        };
                        let filtter = {
                                $or : [
                                  {
                                        $and : [
                                              { sender_id : mongoose.Types.ObjectId(userData._id) },
                                              { reciever_id : mongoose.Types.ObjectId(payloadData.reciever_id) },
                                        ]
                                  },
                                  {
                                        $and : [
                                              { sender_id :  mongoose.Types.ObjectId(payloadData.reciever_id) },
                                              { reciever_id :mongoose.Types.ObjectId(userData._id) },
                                        ]
                                  }
                                ]
                        }
                        let messageList = await chatAggregation.list_message_reciver(filtter,userData._id)
                        return messageList ;


    }
    else if(payloadData.channel_id){

                      let group_chat = await chatAggregation.list_message_groups(payloadData.channel_id,userData._id) ;
                      // console.log()
                      return group_chat ;
    };
   
  }catch(err){
    throw err ; 
  }
};

const list_last_messages = async(payloadData,userData) =>{
  try{

    let Model = Models.last_messages ;
    let query = {
      $or : [
        { sender_id :  userData._id },
        { reciever_id : userData._id },
        {'status_data.user_id' : userData._id},
      ],
      is_deleted : false
    };
    if(payloadData.company_id){
              let chack_data =  await commonController.check_company_id(payloadData.company_id)
              if(chack_data != null){ 
                    throw ERROR.INVALID_COMPANY_ID 
              }
              query.company_id = payloadData.company_id
    }
    let popylate = [
      {
        path : "sender_id",
        select : "_id full_name email profile_picture isAvailable"
      },
      {
        path : "reciever_id",
        select : "_id full_name email profile_picture isAvailable"
      },
      {
        path : "channel_id",
        select : "_id channel_name image description"
      }
    ]
    let options = { lean : true , sort : {date : -1} };
    let show_data = await DAO.populateChatData(Model,query,{__v : 0},options,popylate) ;
    //  console.log("show_data ------",show_data) ;
    let return_data = [] ;
    if(show_data.length != 0){

      for(let data of show_data){ 

              if(data.chat_format == "group"){

                        // let fetch_chanel_membrr_name = await commonController.fetch_names(data);
                        // data.memberNames = fetch_chanel_membrr_name ;
                        // let query_for_chat = {
                        //   channel_id : data.channel_id,
                        //   company_id : data.company_id,
                        //   is_deleted : false,  
                        //   sender_id : {$nin : [userData._id]},
                        //   status_data : { $elemMatch: { user_id :userData._id,is_read : false,is_deleted : false  }}
                        // };
                        
                        // console.log("query_for_chat -----",query_for_chat) ;
                        // let fetch_unread_message = await commonController.fetch_unread_group_message(data,userData) ;
                        // let get_data = await DAO.getData(Models.chats,query_for_chat,{__v : 0},{lean : true });
                        let unread_grp_message = await commonController.fetch_unread_group_message(data,userData) ;
                        // console.log("unread_grp_message -----",unread_grp_message) ;
                        data.unreadCount = unread_grp_message 
                        
              }else{

                      let fetch_unread_message = await commonController.unread_message_count(data,userData) ;
                      // if(fetch_unread_message != 0){
                        data.unreadCount = fetch_unread_message ;
              //   }else{
              //     data.unreadCount = 0 ;
              //   }
              }
        
              if(payloadData.search){
                        let query = {
                          $or :[
                            { _id : data.reciever_id._id } ,
                            { _id :  data.sender_id._id } 
                          ],
                          isDeleted : false,
                        };
                        if(payloadData.company_id){
                          query.company_id = payloadData.company_id
                        }
                        let fetch_search = await DAO.getData(Models.users,query,{__v : 0},{lean : true}) ;
                        if(fetch_search.length != 0){
                          return_data.push(data) ;
                        };
              }else{
                    return_data.push(data) ;
              };
      };
    }; 
    // console.log("return_data 3667---->>>",return_data) ;
    return  return_data ;
  }catch(err){
    throw err ;
  };
};

const delete_chats = async(payloadData,userData) => {
  try{
    let Model = Models.chats ;
    let allId =  payloadData.reciever_id;
    console.log("allId --->>",allId) ;
    let array = [] ;
    if(allId.length != 0){
      for(let id of allId ){
        // console.log("<----- array --->>> 3685",array) ;
        let query = {
          $or : [
            {
              $and : [
                { sender_id : userData._id },
                { reciever_id : id },
              ]
            },
            {
              $and : [
                { sender_id :  id },
                { reciever_id : userData._id },
              ]
            }
          ],
          is_deleted : false
        };
        let get_temp_data = await DAO.getData(Model,query,{_id : 1},{lean : true}) ;
        console.log("get_temp_data --->>>",get_temp_data) ;
        let delete_chats = await DAO.updateMany(Model,query,{is_deleted : true},{new : true}) ;
        console.log("delete_chats ---->>>",delete_chats) ;
        let remove_last_messages = await DAO.updateMany(Models.last_messages,query,{is_deleted : true},{new : true});
      };
    };
    return{  Message : "Chat Deleted." }
  }catch(err){
    throw err ;
  };
};

const send_group_message = async(payloadData,userData) => {
  try{
    let currrent_time = moment().format('x') ;
    let Model = Models.chats ;
    let data_to_save = {
      sender_id : userData._id,
      channel_id : payloadData.channel_id,
      chat_format : "group",
      date :  currrent_time ,
      time : currrent_time,
    }; 
    if(payloadData.message){ data_to_save.message = payloadData.message ; };
    if(payloadData.message_type){data_to_save.message_type = payloadData.message_type ; };
    let save_chats = await DAO.saveData(Model,data_to_save) ;
    /* fetch members of the channnl */
    let channels_members = await commonController.fetch_channel_members(payloadData.channel_id) ;
    if(channels_members.length != 0){
      for(let member of channels_members){
        // console.log("channel member in chat db ----------",member) ;
        let update_read_status = await commonController.update_read_status(Models.chats,save_chats._id,member.member_id); 
        let send_chat_noti = await notificationController.send_chat_notification(member.member_id,save_chats._id,userData._id,payloadData.message);
      };
    };
    /**last message data **/
    let fetch_last_message_data = await commonController.last_messages(payloadData,userData) ;
    // console.log("fetch_last_message_data -----",fetch_last_message_data) ;
    if(fetch_last_message_data.length != 0){
      console.log("data is in if condition")
      let query_data = { channel_id : payloadData.channel_id } ;
      let update_last_message = await DAO.findAndUpdate(Models.last_messages,query_data,data_to_save,{ new : true }) ;
      let channels_members = await commonController.fetch_channel_members(payloadData.channel_id) ;
      if(channels_members.length != 0){
        for(let member of channels_members){
          // console.log("channel member in last mesage db ----------",member) ;
          let update_read_status = await commonController.update_read_status(Models.last_messages,update_last_message._id,member.member_id); 
        };
      };
    }else{
      console.log("data is in else condition")
      let save_last_message = await DAO.saveData(Models.last_messages,data_to_save) ;
      let channels_members = await commonController.fetch_channel_members(payloadData.channel_id) ;
      // console.log("channels_members --------,",channels_members) ;
      if(channels_members.length != 0){
        for(let member of channels_members){
          let update_read_status = await commonController.update_read_status(Models.last_messages,save_last_message._id,member.member_id); 
        };
      };
    };
    return save_chats ;
  }catch(err){
    throw err ;
  };
};

const react_to_message = async(payloadData,userData) =>{
  try{
    let emoji_count ;
    console.log("payloadData----- 3750 ---->>>",payloadData) ;
    let curren_date = moment().format('x') ;
    let message_detail = await DAO.getDataOne(Models.chats,{_id : payloadData.message_id },{__v : 0},{lean : true}) ;
    // console.log("<<<< ----- message_detail ------>>>>",message_detail) ;
    let length_of_reply_array =  message_detail.reply.length ;
    // length_of_reply_array
    let query = {
      _id : payloadData.message_id ,
      is_deleted : false
    }
    let data_to_save = { reply_of_message : "yes"  };
    if(payloadData.emoji){
      let emoji_count = 0 ;
      let check_if_already_react = await commonController.is_alreay_reacted_on_message(payloadData,userData) ;
      console.log("check_if_already_react---->>>>",JSON.stringify(check_if_already_react)) ;

      if(check_if_already_react.length != 0){
        let user_reaction_data  ;
        reaction_array = message_detail.reaction  ;

        for(let data of reaction_array){
          console.log("data----->>>>",data) ;
          if( data.emoji === payloadData.emoji ){
            console.log("data---->>>>>",data);
            let daat_array = [] ;
            daat_array = data.user_id ;
            const updatedArray = daat_array.filter((item , index) => item.toString() != userData._id.toString() )
            console.log("updatedArray",updatedArray) ;
            let total_coutn = updatedArray.length ;
            let query_for_emoji = {
              _id : payloadData.message_id ,
              reaction : {
                $elemMatch : {
                  emoji : payloadData.emoji,
                }
              }
            };
            // console.log("query_for_emoji------->>>>",query_for_emoji);
            let message__detail = await DAO.getDataOne(Models.chats,{_id : payloadData.message_id },{__v : 0},{lean : true}) ;
            let get_reaction_array = message__detail.reaction ;
            console.log("get_reaction_array =====>>>>>>>>",get_reaction_array) ;
            let final_update_array = get_reaction_array.filter((item)=> { 
              console.log("item",item) ;
              return item.emoji != payloadData.emoji ;
            }) ;
            console.log("final_update_array---->>>",final_update_array)
            final_update_array.push({
              emoji : payloadData.emoji,
              user_id : updatedArray,
              total_count : total_coutn
            });
            let array_after_final_filter = final_update_array.filter((item)=>{
              return item.total_count != 0 ;
            })
            
            let emoji_data_save ={ 
              $set:{
                reaction : array_after_final_filter
              }
            }
            let data_to_save = await DAO.findAndUpdate(Models.chats,query_for_emoji,emoji_data_save,{new : true}) ;
            console.log("data_to_save ======>>>> case 1======>>>",data_to_save);
            return data_to_save ;
          };
        };
      }else{
        console.log("<<---- in else part --->>>")
        let user_already_reacted_on_message = await commonController.alreay_reaction_on_message(payloadData) ;
        // console.log("user_already_reacted_on_message ---->>>",JSON.stringify(user_already_reacted_on_message)) ;
        if(user_already_reacted_on_message.length != 0){
          console.log(".......case 2..........")
          let message_array = user_already_reacted_on_message[0].reaction ;
          console.log("message_array---->>>",message_array);
          let reaction_array = message_array.reaction  ;
          console.log("reaction_array---->>>",reaction_array) ;
          if(message_array.length != 0){
            for(let data of message_array) {
              if(data.emoji == payloadData.emoji){
                let all_user_id = data.user_id ;
                all_user_id.push(userData._id) ;
                let total_count = all_user_id.length ; 
                
                let query_for_emoji = {
                  _id : payloadData.message_id ,
                  reaction : {
                    $elemMatch : {
                      emoji : payloadData.emoji,
                    }
                  }
                };
    
                let message__detail = await DAO.getDataOne(Models.chats,{_id : payloadData.message_id },{__v : 0},{lean : true}) ;
                let get_reaction_array = message__detail.reaction ;
            
                let final_update_array = get_reaction_array.filter((item)=> { 
                  console.log("item",item) ;
                  return item.emoji != payloadData.emoji ;
                }) ;
                
                final_update_array.push({
                  emoji : payloadData.emoji,
                  user_id : all_user_id,
                  total_count : total_count
                })
                let array_after_final_filter = final_update_array.filter((item)=>{
                  return item.total_count != 0 ;
                });
                let emoji_data_save ={ 
                  $set:{
                    reaction : array_after_final_filter
                  }
                }
                let data_to_save = await DAO.findAndUpdate(Models.chats,query_for_emoji,emoji_data_save,{new : true}) ;
                return data_to_save ;
              }
            }
          }
        }else{
          console.log("......case 3 .......")
          let new_object = {
            emoji : payloadData.emoji,
            total_count : 1,
            user_id : [userData._id],
          };
          let query_for_emoji = {
            _id : payloadData.message_id ,
          };
          let emoji_data_save ={
            $push :{
              reaction : new_object 
            }
          }
          let data_to_save = await DAO.findAndUpdate(Models.chats,query_for_emoji,emoji_data_save,{new : true}) ;
          return data_to_save ; 
        };
      }
    };


    if(payloadData.message){
      data_to_save= {
        $push :{
          reply : {
            time : curren_date ,
            message : payloadData.message,
            user_id : userData._id,
            index :  parseInt(length_of_reply_array) + 1 ,
          }
        }
      }
      let update_detail = await DAO.findAndUpdate(Models.chats,query,data_to_save,{new : true}) ;
      return update_detail ;
    };
   
  }catch(err){
    throw err ;
  }
};

const reply_to_message = async(payloadData,userData) =>{
  try{
    let curent_date = moment().format('x') ;
    let Model = Models.chats ;
    let query = {
      sender_id : userData._id,
      // channel_id : payloadData .channel_id,
      conversation_id : payloadData.conversation_id,
      date  : curent_date,
      time : curent_date,
      chat_format : "group",
      message_type : payloadData.message_type,
      message : payloadData.message
    };
    let save_data = await DAO.saveData(Model,query) ;
    let data_to_increase = {
      $inc : {
        total_reply_count : 1 
      }
    }
    let update_reply_count_of_message = await DAO.findAndUpdate(Model,{_id : payloadData.conversation_id },data_to_increase,{new : true}) ;
    return save_data  ;
  }catch(err){
    throw err ;
  };
};

const list_of_reacted_message = async(payloadData,userData) =>{
  try{

    let filtter ={
         conversation_id : mongoose.Types.ObjectId(payloadData.conversation_id),
    };
    let messageList = await chatAggregation.list_message_reciver(filtter,userData._id)
    return messageList ;
  }catch(err){
    throw err ;
  };
}

const exit_channel = async(payloadData,userData)=> {
  try{
    // console.log("payloadData ----",payloadData) ;
    let Model = Models.channel_members ;
    let query = {
      member_id : userData._id,
      company_id : payloadData.company_id,
      // compny_address_id :payloadData.compny_address_id ,
      company_channels_id : payloadData.company_channels_id ,
    };
    if(payloadData.member_id){
      query = {
        member_id : payloadData.member_id,
        company_id : payloadData.company_id,
        // compny_address_id :payloadData.compny_address_id ,
        company_channels_id : payloadData.company_channels_id ,
      };
    };

    let exit_compny_cahnnel = await DAO.remove1(Model,query) ;
    // console.log("exit_compny_cahnnel ----",exit_compny_cahnnel) ;
    return exit_compny_cahnnel ;
  }catch(err){
    throw err ; 
  };
};

const make_channel_admin = async(payloadData,userData) => {
  try{
    // console.log("payloadData in make admin ----",payloadData) ;
    let Model = Models.channel_members ;
    let qury = {  
      member_id : payloadData.member_id,
      company_channels_id : payloadData.company_channels_id ,
      is_deleted : false
    }
    let update_data = {} ;
    if(payloadData.is_admin == true || payloadData.is_admin == false ){
      update_data.is_admin = payloadData.is_admin 
    }
    let make_admin = await DAO.findAndUpdate( Model,qury,update_data,{ new : true } ) ;
    // console.log("make_admin in make admin ----",make_admin) ;
    return make_admin ;
  }catch(err){
    throw err ;
  };
};

const channel_detail = async(payloadData,userData) =>{
  try{
    let blockArray = [] ;
    let Model = Models.company_channels ;
    let query = { 
      _id : payloadData._id,
      is_deleted : false
    };
    let populate = [
      {
        path : "user_id",
        select : "_id full_name status iso2_code email"
      }
    ]
    let feth_channel_detail = await DAO.populate_Data(Model,query,{ __v : 0 },{ lean : true },populate) ;
    if( feth_channel_detail.length != 0 ){
      for(let data of feth_channel_detail ){
        let fetch_blocked_users = await commonController.blocked_users_list(userData) ;
        if(fetch_blocked_users.length != 0){
          for(let block of fetch_blocked_users) {
            blockArray.push(block) ;
          };
        };
        // console.log("blockArray -------",blockArray) ;
        let query_data = {
          company_channels_id : data._id,
          is_deleted : false
        };
        if( blockArray.length != 0 ){ query_data.member_id = { $nin : blockArray } ;} ;

        let populate = [
          {
            path : "member_id",
            select :"_id full_name country_code email contact_number profile_picture isAvailable"
          }
        ]
        let populate_chanlle_members = await DAO.populate_Data( Models.channel_members,query_data,{ __v : 0 },{ lean :true },populate ) ;
        // console.log("populate_chanlle_members =====",populate_chanlle_members);
        let fetch_chanlle_members = await DAO.getData( Models.channel_members,query_data,{ __v : 0 },{ lean :true } ) ;
        if(fetch_chanlle_members.length != 0){
          data.count  = fetch_chanlle_members.length ;
        }else{
          data.count  = 0 ;
        };
        if(populate_chanlle_members.length != 0){
          data.member = populate_chanlle_members ;
        }else{
          data.member = [] ;
        };
      };
    };
    // console.log("feth_channel_detail =======",feth_channel_detail) ;
    return feth_channel_detail ;
  }catch(err){
    throw err ;
  };
};

const get_user_detail = async(payloadData,userData )=> {
  try{
    let Model = Models.users  ;
    let query = {
      _id : payloadData._id,
      isDeleted : false,
      isBlocked : false
    };
    let populate = [
      {
        path : "company_id",
        select : "_id name"
      },
      {
        path : "department_id",
        select : "_id name"
      },
      {
        path : "compny_address_id",
        select : "_id address"
      }

    ]
    let fetch_data = await DAO.populateSingleData(Model,query,{__v : 0},{lean : true },populate) ;
    return fetch_data ;
  }catch(err){
    throw err ;
  };
};

const add_participent = async(payloadData,userData) => {
  try{
    // console.log("payloadData 0000",payloadData) ;
    let Model = Models.channel_members  ;
    let member = payloadData.member_id ;
    if(payloadData.member_id){
      for(let mem of member ){
        // let check_if_already_exist = await commonController.member_already_exist(mem,payloadData) ; 
        let save_data = {
          company_channels_id : payloadData.company_channels_id,
          member_id : mem,
          company_id : payloadData.company_id,
          compny_address_id : payloadData.compny_address_id
        };
        let save_detail = await DAO.saveData(Model,save_data) ; 
      };
    };
  }catch(err){
    throw err ;
  };
};

const on_off_notifications = async(payloadData,userData) => {
  try{
    let Model = Models.company_channels  ;
    let query = {
      _id : payloadData._id,
      is_deleted : false,
    };
    let update = {};
    if(payloadData.notification_allowed === true || payloadData.notification_allowed === false){
      update.notification_allowed = payloadData.notification_allowed 
    };
    let update_noti = await DAO.findAndUpdate(Model,query,update,{new : true}) ;
    return update_noti ;
  }catch(err){
    throw err ;
  };
};

const clear_chats = async(payloadData,userData) => {
  try{
    let Model = Models.chats ;
    let query = {
      channel_id : payloadData.channel_id,
      status_data : {
        $elemMatch :{
          is_deleted : false,
          user_id : userData._id,
        }
      },
      // is_deleted : false
    };
    let update = { "status_data.$is_deleted" : true }
    let clear_chat_data = await DAO.updateMany(Model,query,update,{new : true}) ;
    return{
      "message" :"chat cleared !"
    }
  }catch(err){
    throw err ;
  }
};

const add_money_to_wallet = async(payloadData,userData) => {
  try{
    let check_company_and_address_are_same_or_not = await commonController.if_company_and_address_are_same(userData) ;
    if(check_company_and_address_are_same_or_not.length != 0){ throw ERROR.ADDRESS_DETAILS_MISMATCH } ;
    let data_to_add = {
      $inc : { wallet_ammount : payloadData.ammount }
    };
    let update_wallet_ammount = await DAO.findAndUpdate(Models.users,{ _id : userData._id },data_to_add,{new : true}) ;
    let current_date = moment().format("x") ;
    let wallet_data = {
      user_id : userData._id,
      status : "credit",
      date : current_date ,
      ammount : payloadData.ammount,
    }
    let save_wallet_history = await DAO.saveData(Models.wallets,wallet_data) ;
    return save_wallet_history  ;
  }catch(err){
    throw err ;
  };
};

const send_money_to_user_from_wallet = async(payloadData,userData) =>{
  try{
    if(payloadData.ammount > userData.wallet_ammount){ throw ERROR.INSUFFICIENT_BALANCE ; };

    let current_date = moment().format("x") ;
    let wallet_data_of_reciever = {
      user_id : payloadData.sender_id,
      sender_id : userData._id,
      status : "credit",
      date : current_date ,
      hashtag : payloadData.hashtag,
      ammount : payloadData.ammount,
    };
    let wallet_data_of_sender = {
      user_id : userData._id,
      sender_id : payloadData.sender_id,
      status : "debit",
      date : current_date ,
      ammount : payloadData.ammount,
    };
    let save_wallet_history_of_reciever = await DAO.saveData(Models.wallets,wallet_data_of_reciever) ;
    let save_wallet_history_of_sender = await DAO.saveData(Models.wallets,wallet_data_of_sender) ;
    let money = payloadData.ammount ;
    let data_to_add = { $inc : { wallet_ammount : payloadData.ammount } }; 
    let ammount_decrement = { $inc : { wallet_ammount : - money } };     
    let update_wallet_of_reciver = await DAO.findAndUpdate(Models.users,{ _id : payloadData.sender_id },data_to_add,{ new : true }) ;
    let update_wallet_of_sender = await DAO.findAndUpdate(Models.users,{ _id : userData._id},ammount_decrement,{ new : true }) ;

    return save_wallet_history_of_reciever  ;
  }catch(err){
    throw err ;
  }
};

const task_review_by_admin = async(payloadData,userData) => {
  try{
    let current_date = moment().format("x") ;
    let Model = Models.tasks_members ; 
    let conditon = {  task_id : payloadData.task_id,  member_id : payloadData.member_id, is_deleted : false };
   
    let data_to_update = {} ;
    let get_tsk_detail = await DAO.getDataOne(Models.tasks,{_id :  payloadData.task_id},{__v : 0},{lean : true}) ;
    if(payloadData.task_completed_by_admin === true || payloadData.task_completed_by_admin === false){
      data_to_update.task_completed_by_admin = payloadData.task_completed_by_admin ;
    } ;
    if(payloadData.task_completed === true || payloadData.task_completed === false){
      data_to_update.task_completed = payloadData.task_completed ;
    } ;
    let update_task_data = await DAO.findAndUpdate(Model,conditon,data_to_update,{new : true }) ;
    if(update_task_data.task_completed_by_admin === true ){
      let change_status_of_task = await DAO.findAndUpdate(Models.tasks,{_id :  payloadData.task_id},{status : "Complete"},{new : true}) ;
      let money_to_deduct = { $inc : { wallet_ammount : -get_tsk_detail.coins } }  ;
      let reduce_price_from_admin = await DAO.findAndUpdate(Models.users,{_id : get_tsk_detail.user_id},money_to_deduct,{new : true}) ;
      let add_price_to_user = await DAO.findAndUpdate(Models.users,{_id : payloadData.member_id,},{$inc : {wallet_ammount : get_tsk_detail.coins}},{new : true}) ;
      /*------------------*/
      let wallet_data_of_reciever = {   ammount : get_tsk_detail.coins,date : current_date , user_id : payloadData.member_id, sender_id : get_tsk_detail.user_id,status : "credit",};
      let send_noti_to_user_for_reward = await notificationController.send_reward_notification(wallet_data_of_reciever) ;
      let save_wallet_history_of_reciever = await DAO.saveData(Models.wallets,wallet_data_of_reciever) ;
      /*------------------*/
      let wallet_data_of_sender = { ammount : get_tsk_detail.coins , date : current_date , user_id : get_tsk_detail.user_id, status : "debit",};
      let save_wallet_history_of_sender = await DAO.saveData(Models.wallets,wallet_data_of_sender) ;
    };
    let remove_noti_from_list = await DAO.findAndUpdate(Models.notifications,{_id : payloadData.notification_id },{is_deleted : true},{lean : true}) ;
    
    return update_task_data ;
  }catch(err){
    throw err ;
  };
};

const wallet_history = async(payloadData,userData) => {
  try{
    let Model = Models.wallets ;
    let query = { user_id : userData._id, status : payloadData.status ,is_deleted  : false } ;
    let populate = [
      {
        path  : "user_id",
        select : "_id full_name",
      },
      {
        path  : "sender_id",
        select : "_id full_name",
      }
    ]
    let return_result = await DAO.populateData(Model,query,{_v : 0},{lean : true},populate) ;
    return return_result ;
  }catch(err){
    throw err ;
  };
};

const list_hashtags = async(payloadData) =>{
  try{
    let Model = Models.hashtags  ;
    let query = { is_deleted : false } ;
    if(payloadData._id){
      query = {  _id : payloadData._id , is_deleted : false  };
    }; 
    let number = 0 ;
    if(payloadData.skip_page){
      number = payloadData.skip_page ;
    };
    let fetch_data = await DAO.getDataUser(Model,query,{__v : 0},{lean : true},number) ;
    let fetch_all_data = await DAO.getData(Model,query,{ __v : 0 }, {lean : true}) ;
    return {
      Count : fetch_all_data.length ,
      fetch_data 
    };
  }catch(err){
    throw err ;
  };
};

const list_vouchers = async(payloadData) =>{
  try{
    let Model = Models.vouchers  ;
    let query = { is_deleted : false } ;
    if(payloadData._id){
      query = {  _id : payloadData._id , is_deleted : false  };
    }; 
    let number = 0 ;
    if(payloadData.skip_page){
      number = payloadData.skip_page ;
    };
    let fetch_data = await DAO.getDataUser(Model,query,{__v : 0},{lean : true},number) ;
    let fetch_all_data = await DAO.getData(Model,query,{ __v : 0 }, {lean : true}) ;
    return {
      Count : fetch_all_data.length ,
      fetch_data 
    };
  }catch(err){
    throw err ;
  };
};

const reedem_vouchers = async(payloadData,userData) =>{
  try{
    let Model = Models.user_vouchers ;
    let curren_date = moment().format("x") ;
    let data = {
      user_id : userData._id,
      voucher_id : payloadData.voucher_id
    };
    let save_data  = await DAO.saveData(Model,data) ;
    let get_voucher_ammount = await commonController.get_voucher_data(payloadData) ;
    let final_ammount =  get_voucher_ammount.ammount  ;
    let save_wallet_history = await DAO.saveData(Models.wallets,{user_id : userData._id ,status : "debit", ammount : get_voucher_ammount.ammount, date : curren_date}) ;
    let data_to_add = { $inc : { wallet_ammount : -final_ammount} }; 
    let update_wallet_of_reciver = await DAO.findAndUpdate(Models.users,{ _id : userData._id },data_to_add,{ new : true }) ;
  }catch(err){
    throw err ;
  };
};

const list_leaderboard = async(payloadData,userData) =>{
  try{
    let position = 1 ;
    let memberArray  = [] ;
    /**fetch all the users which are blocked by me**/
    let fetch_all_blocked_users = await commonController.blocked_users_list(userData) ;
    if(fetch_all_blocked_users.length != 0){
      for(let detail of fetch_all_blocked_users){
        memberArray.push(detail) ;
      };
    };
    let get_users_of_company = await commonController.member_of_company_with_address(payloadData,userData,memberArray) ;
    if(get_users_of_company.length != 0){
      for(let user of get_users_of_company){
        let get_wallet_ammount = await commonController.wallet_ammount_of_user(user) ;
        user.earned_coins = get_wallet_ammount ;
      };
    };
    let sorted_data = get_users_of_company.sort((a, b) => (parseFloat(a.earned_coins) > parseFloat(b.earned_coins) ? -1 : 1))
    // console.log("sorted_data ---->>>",sorted_data) ;
    if(sorted_data.length != 0){
      for(let data of sorted_data){
        data.position = position ;
        position ++ ;
      };
    };
    return sorted_data  ;
  }catch(err){
    throw err ;
  }
};

const filtered_leaderboard = async(payloadData,userData) =>{
  try{
    let position = 1 ;
    let memberArray  = [] ;
    /**fetch all the users which are blocked by me**/
    let fetch_all_blocked_users = await commonController.blocked_users_list(userData) ;
    if(fetch_all_blocked_users.length != 0){
      for(let detail of fetch_all_blocked_users){
        memberArray.push(detail) ;
      };
    };
    let get_users_of_company = await commonController.member_of_company_with_address(payloadData,userData,memberArray) ;
    if(get_users_of_company.length != 0){
      for(let user of get_users_of_company){
        let get_wallet_ammount = await commonController.wallet_ammount_of_user(user) ;
        user.earned_coins = get_wallet_ammount ;
      };
    };
    let sorted_data = get_users_of_company.sort((a, b) => (parseFloat(a.earned_coins) > parseFloat(b.earned_coins) ? -1 : 1))
    console.log("sorted_data ---->>>>",sorted_data) ;
    if(sorted_data.length != 0){
      for(let data of sorted_data){
        data.position = position ;
        position ++ ;
      };
    };
   
    return sorted_data  ;
  }catch(err){
    throw err ;
  }
};

const list_all_members_of_compnay = async(payloadData,userData) =>{
  try{
    let Model = Models.users ;
    let queries ={
      isDeleted  : false,
      isBlocked : false,
      company_id : payloadData.company_id,
      _id : {$ne : userData._id},
    };
    let return_data = await DAO.getData(Model,queries,{__v : 0},{lean : true} ) ;
    return return_data  ;
  }catch(err){
    throw err ;
  };
};

const deleted_channel_list_for_admin = async(payloadData,userData ) =>{
  try{
    let check_compny_and_address = await commonController.if_company_and_address_are_same(payloadData)
    if(check_compny_and_address.length != 0 ){
      let query = { is_deleted : true  };
      let fetch_all_channels = await DAO.getData(Models.company_channels,query,{__v : 0},{lean : true }) ;
      if(fetch_all_channels.length != 0){
        for(let data of fetch_all_channels){
          let get_members_of_channel = await commonController.fetch_channel_members(data._id) ; 
          data.member_count = get_members_of_channel.length  ;
        };    
      };
      return fetch_all_channels ;
    }else{
      throw ERROR.COMPANY_DONT_EXIST ;
    }
  }catch(err){
    throw err ;
  };
};

const delete_channel_permanently_as_admin = async(payloadData,userData) =>{
  try{
    let all_channles_id = payloadData.channel_ids ;
    let delete_query ={
      _id : {$in : all_channles_id}
    };
    let remove_channel = await DAO.remove(Models.company_channels,delete_query) ;
    if(remove_channel){
      let query = {
        company_channels_id :  {$in : all_channles_id}
      }
      let remove_members_of_channels = await DAO.remove(Models.channel_members,query) ;
    };
    return {
      "message" :"Channel deleted permanently.!" 
    };
  }catch(err){
    throw err ;
  };
};

const accept_reject_meeting = async(payloadData,userData) =>{
  try{
    let query ={ member_id : userData._id, meeting_id : payloadData.meeting_id,} ;
    if(payloadData.invite == "accept"){
      return { "message":"be on the time." };
    }else if(payloadData.invite == "reject"){
      let remove_member_from_meet = await DAO.remove1(Models.meeting_members,query) ;
      return { "message":"invite rejected" };
    };
  }catch(err){
    throw err ;
  };
};

const delete_message = async(payloadData,userData)=>{
  try{

    let Model = Models.chats ;
    let query_data  = { _id : payloadData.message_id,  } ;
    let check_message = await DAO.getDataOne(Model,query_data,{conversation_id :1},{lean : true}) ;
    if(check_message != null){

                  let query = { _id : check_message.conversation_id,is_deleted : false  } ;
                  let check_reply_of = await DAO.getDataOne(Model,query,{_id : 1,total_reply_count :1},{lean : true}) ;
                  if(check_reply_of != null){

                          let new_count = check_reply_of.total_reply_count - 1
                          let update = {
                              total_reply_count : new_count
                          }
                          await DAO.findAndUpdate(Model,query,update,{new : true})

                  }

    }
    let query = { _id : payloadData.message_id  } ;
    let delete_mesage = await DAO.remove1(Model,query) ;

    let thread_message_id = [] ;
    let fetch_thread_of_message = await DAO.getData(Model,{conversation_id : payloadData.message_id },{_id : 1},{lean : true}) ;
    if(fetch_thread_of_message.length != 0){
      for(let messagge of fetch_thread_of_message){
           thread_message_id.push(messagge._id) ;
      };
    };
    let delete_thread = await DAO.remove( Model,{ _id : {$in : thread_message_id } } ) ;
    return {  "message" : "Message Deleted.!"  };


    
    // if(check_message != null){

    //         let query = { _id : payloadData.conversation_id,is_deleted : false  } ;
    //         let check_reply_of = await DAO.getDataOne(Model,query,{_id : 1,total_reply_count :1},{lean : true}) ;
    //         if(check_reply_of != null){

    //                 let new_count = total_reply_count - 1
    //                 let update = {
    //                     total_reply_count : new_count
    //                 }
    //                 await DAO.findAndUpdate(Model,query,update,{new : true})

    //         }
    // }
     

    // let condition = {
    //       _id : payloadData.message_id,
    //       status_data : { $elemMatch: { user_id : userData._id}},
    // }
    // let update_data = {
    //   $set: {
    //     "status_data.$.is_deleted" : true
    //   }
              
    // }
    // let delete_mesage =  await DAO.findAndUpdate(Model,condition,update_data,{new : true})

    // // let thread_message_id = [] ;
    
    // let condition_2 = {
    //       status_data : { $elemMatch: { user_id : userData._id}},
    //       conversation_id : payloadData.message_id 
    // }
    // let fetch_thread_of_message = await DAO.findAndUpdate(Model,condition_2,update_data,{new : true}) ;

  }catch(err){
    throw err ;
  }
};

const share_message = async(payloadData,userData) =>{
  try{
    let Model = Models.chats ;
    if(payloadData.channel_id ){
      await send_group_message(payloadData,userData) ;
    }else{
      await send_message(payloadData,userData) ;
    };
  }catch(err){
    throw err ;
  };
};

const save_unsave_chats = async(payloadData,userData) =>{
  try{
    let Model = Models.saved_items ;
    let save_data ={
      user_id : userData._id,
      message_id : payloadData.message_id
    };
    let if_data_already_exist = await DAO.getDataOne(Model,save_data,{_id : 1},{lean :  true}) ;
    if(if_data_already_exist != null){

            let data_to_update = {} ;
            if(payloadData.is_saved == true || payloadData.is_saved == false){
                 data_to_update.is_saved = payloadData.is_saved ;

              if(payloadData.is_saved){
                  data_to_update.created_at = +new Date()
              }
            };
            let update_existing_data = await DAO.findAndUpdate(Model,save_data,data_to_update,{lean : true}) ;
            return update_existing_data ;

    }else{

          if(payloadData.is_saved == true || payloadData.is_saved == false){
            save_data.is_saved = payloadData.is_saved ;
            save_data.created_at = +new Date()
          };
          let saved_data = await DAO.saveData(Model,save_data) ;
          return saved_data ;

    };
  }catch(err){
    throw err ;
  };
};

const list_saved_message = async(payloadData,userData) =>{
  try{
    let Model = Models.saved_items ;
    let qeury = {
      user_id : userData._id,
      is_deleted : false,
    };
    let populate = [
      {
        path : "message_id",
        select: "_id sender_id message_type reciever_id message date time",
        populate :[
          {
            path : "sender_id",
            select : "_id full_name profile_picture"
          },
          {
            path : "reciever_id",
            select : "_id full_name profile_picture"
          },
        ]
      }
    ]
    let skip_num = 0 
    if(payloadData.skip_num){
      skip_num = payloadData.skip_num ;
    }
    let populated_data = await DAO.populateDataUser(Model,qeury,{is_deleted : 0,updatedAt : 0,__v :0},{lean : true},populate,skip_num) ;
    return populated_data ;
  }catch(err){
    throw err ;
  }
}



const contact_us = async(payloadData) =>{
  try{

       let set_data = {

             name : payloadData.name,
             email : payloadData.email,
             message : payloadData.message,
       }
       let save_data = await DAO.saveData(Models.queires,set_data)
       return save_data
  }catch(err){
    throw err ;
  }
}

// const create_conversation_reply = 

module.exports = {
  imageUpload: imageUpload,
  data_to_save: data_to_save,
  return_data: return_data,
  sign_up : sign_up,
  social_login : social_login,
  list_departments : list_departments,
  updatePassword: updatePassword,
  forgotPassword: forgotPassword,
  otpVerified: otpVerified,
  otpResend: otpResend,
  login: login,
  accessTokenLogin: accessTokenLogin,
  logout: logout,
  add_companies : add_companies,
  list_companies : list_companies,
  list_company_address : list_company_address,
  add_channels : add_channels,
  invite_company_members : invite_company_members,
  list_plans : list_plans,
  add_user_plan : add_user_plan,
  list_user_plans : list_user_plans,
  list_company_members : list_company_members,
  add_edit_channels_with_members : add_edit_channels_with_members,
  list_channels_with_count : list_channels_with_count,
  vendor_list_channels : vendor_list_channels,
  add_edit_tasks : add_edit_tasks,
  list_assigned_task : list_assigned_task,
  delete_task : delete_task,
  task_complete_by_user : task_complete_by_user ,
  fetch_task_details : fetch_task_details,
  add_edit_polls : add_edit_polls,
  add_respond_to_polls : add_respond_to_polls,
  list_status : list_status,
  edit_profile : edit_profile,
  delete_user_channels : delete_user_channels,
  list_about_us : list_about_us,
  list_policies : list_policies,
  list_terms : list_terms,
  create_qr_code : create_qr_code,
  block_users : block_users,
  list_blocked_users : list_blocked_users,
  list_polls : list_polls,
  change_availability : change_availability,
  delete_polls : delete_polls,
  list_answers_respond : list_answers_respond,
  add_edit_meeting : add_edit_meeting,
  list_all_meetings : list_all_meetings,
  list_meeting_members : list_meeting_members,
  delete_meeting : delete_meeting,
  exit_channel : exit_channel,
  list_notification : list_notification,
  delete_notifcations : delete_notifcations,
  task_review_by_admin : task_review_by_admin,
  list_unread_notification : list_unread_notification,
  search_data : search_data,
  add_edit_ques_ans : add_edit_ques_ans,
  list_ques_ans : list_ques_ans,
  delete_ques_ans : delete_ques_ans,
  assign_ques_ans : assign_ques_ans,
  respond_to_ques_ans : respond_to_ques_ans,
  list_ques_ans_respond_by_member : list_ques_ans_respond_by_member,
  list_ques_ans_user_side : list_ques_ans_user_side,
  list_all_ques_responded_with_count : list_all_ques_responded_with_count,
  list_task_by_id : list_task_by_id,
  filter_tasks  : filter_tasks,
  filter_polls : filter_polls,
  filter_meetings : filter_meetings,
  get_all_question_count : get_all_question_count,
  send_message : send_message,
  user_message_listing : user_message_listing,
  list_last_messages : list_last_messages,
  read_messages : read_messages,
  delete_chats : delete_chats,
  send_group_message : send_group_message,
  make_channel_admin : make_channel_admin,
  channel_detail : channel_detail,
  get_user_detail : get_user_detail,
  add_participent : add_participent,
  on_off_notifications  : on_off_notifications,
  clear_chats : clear_chats,
  add_money_to_wallet : add_money_to_wallet,
  send_money_to_user_from_wallet : send_money_to_user_from_wallet,
  wallet_history : wallet_history,
  list_hashtags : list_hashtags,
  list_vouchers : list_vouchers,
  reedem_vouchers : reedem_vouchers,
  unassign_qa_from_user : unassign_qa_from_user,
  list_leaderboard : list_leaderboard,
  filtered_leaderboard : filtered_leaderboard,
  react_to_message : react_to_message,
  reply_to_message : reply_to_message,
  list_of_reacted_message : list_of_reacted_message,
  list_all_members_of_compnay : list_all_members_of_compnay,
  deleted_channel_list_for_admin : deleted_channel_list_for_admin,
  delete_channel_permanently_as_admin : delete_channel_permanently_as_admin,
  accept_reject_meeting : accept_reject_meeting,
  delete_message : delete_message,
  share_message : share_message,
  list_saved_message : list_saved_message,
  save_unsave_chats : save_unsave_chats,
  contact_us : contact_us

};