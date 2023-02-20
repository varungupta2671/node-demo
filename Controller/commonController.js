
const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  UploadMultipart = require("../Libs/UploadMultipart"),
  commonController = require("./commonController"),
  aws = require('../Config/awsS3Config'),
  AWS = require("aws-sdk"),
  fs = require('fs'),
  moment = require('moment'),
  twillio = require('../Config/twilioConfig') ;
  randomstring = require("randomstring"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");
  var md5 = require("md5");
  var QRCode = require('qrcode'); 
  const AccessToken = require('twilio').jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const stripe = require("stripe")("sk_test_51JraWXJ5pphZmj9S4rZv58wlo4pwftdDnBim8cCHFiJCU0vsNwHQITDPYUSEwDw1Xi0nl5MJ8YUd6l3nUvZo9iCl00AFd3EJNO");





const check_user_email_1 = async(email) => {
      try {
    
            let query = { email : email,
                   isDeleted : false ,
                   otpVerified : true ,
                   isSetPassword : true }
            let projection = { _id : 1 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.users, query, projection, options)
    
            return fetch_data
    
      }
      catch(err) {
            throw err;
      }
}
    
const check_user_email_data = async(email) => {
          try {
              let query = { 
                  email : email.toLowerCase(),
                  isDeleted : false 
              }
              let projection = { _id : 1 }
              let options = { lean : true }
              let fetch_data = await DAO.getData(Models.users, query, projection, options)
      
              return fetch_data
        
          }
          catch(err) {
                throw err;
          }
}
const check_user_email_exist = async(email) => {
      try {
    
            let query = { 
                  email : email,
                  isDeleted : false 
            }
            let projection = { _id : 1 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.users, query, projection, options)
    
            return fetch_data ;
     
      }
      catch(err) {
            throw err;
      }
}

const imageUpload = async payloadData => {
  try {
    return new Promise(function (resolve, reject) {
      UploadMultipart.uploadFilesOnS3(payloadData.file, (err, imageUpload) => {
        if (err) {
          console.log("-----------------------err",err)
          reject(err);
        }
        else {
          resolve(imageUpload);
        }
      });
    });
  } catch (err) {
    throw err;
  }
};

const generate_token = async(token_info) => {
      try{
            let token_data = {
                  _id : token_info._id,
                  scope : token_info.scope
            };
            let gen_token = await TokenManager.generateToken( token_data, token_info.scope )

            if(gen_token == null) { throw ERROR.SOMETHING_WENT_WRONG }
            else{
                  // update token in db
                  let query = { _id : token_info._id }
                  let update = { 
                        accessToken : gen_token,
                        isOnline : true
                  };

                  if(token_info.deviceToken){ update.deviceToken = token_info.deviceToken}
                  if(token_info.deviceType){update.deviceType  = token_info.deviceType}  
                  if (token_info.timeZone) {   token_info.timeZone = token_info.timeZone  }  
                  let options = { new : true }
                  let data_to_update = await DAO.findAndUpdate(token_info.collection, query, update, options)

                  return data_to_update ;

            }
      }
      catch(err) {
            throw err;
      }
} ;
// if social key  exists or not
const social_key_exists = async(social_key) => {
    try {

          let query = { 
                social_key : social_key,
                isDeleted:false ,
                isBlocked:false
          }
          let projection = {__v : 0}
          let options = { lean : true }
          let get_data = await DAO.getData(Models.users, query, projection, options)
          return get_data

    }
    catch(err) {
          throw err;
    }
}

const check_followers_id = async(userFollowerId) => {
  try {

        let query = { userFollowerId : userFollowerId ,isDeleted : false}
        let projection = { __v : 0 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.user_followers, query, projection, options)

        return fetch_data

  }
  catch(err) {
        throw err;
  }
}
const check_viewer_id = async(userId ,viewerId) => {
      try {
    
            let query = {userId : userId, viewerId : viewerId ,isDeleted : false}
            let projection = { __v : 0 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.view_posts, query, projection, options)
    
            return fetch_data
    
      }
      catch(err) {
            throw err;
      }
}
const check_post_id = async(userId,postId) => {
      try {
    
            let query = {userId : userId, postId : postId ,isDeleted : false}
            let projection = { __v : 0 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.view_posts, query, projection, options)
    
            return fetch_data
    
      }
      catch(err) {
            throw err;
      }
}
const check_feed_id = async(_id) =>
{
      try {
    
            let query = { _id : _id ,isDeleted : false} ;
            let projection = { __v : 0 } ;
            let options = { lean : true } ;
            let fetch_data = await DAO.getData(Models.feedLikes, query, projection, options) ;
    
            return fetch_data ;
    
      }
      catch(err) {
            throw err;
      }
}

const check_user_type = async(userType) => {
  try {

        let query = { userType : userType ,isDeleted : false}
        let projection = { __v : 0 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.users, query, projection, options)

        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

const check_following_id = async(userFollowingId) => {
      try {
    
            let query = { userFollowingId : userFollowingId ,isDeleted : false}
            let projection = { __v : 0 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.user_following, query, projection, options)
    
            return fetch_data ;
    
      }
      catch(err) {
            throw err;
      }
}

const check_user_email = async(email) => {
  try {

        let query = { email : email.toLowerCase() , isDeleted : false }
        let projection = { _id : 1 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.users, query, projection, options)

        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

const check_email_id = async(id) => {
  try {

        let query = { _id : id , isDeleted : false }
        let projection = { _id : 1 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.sendMails, query, projection, options)

        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

const check_stripe_id = async(id) => {
  try {

        let query = { _id : id }
        let projection = { _id : 1 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.stripCredentials, query, projection, options)
        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

const check_email_credendital_id = async(id) => {
  try {

        let query = { _id : id }
        let projection = { _id : 1 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.emailCredentials, query, projection, options)
        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

// const calculate_time_slot = async(start_time, end_time, interval = "30") =>
// {
//       let i, formatted_time;
//     let time_slots = new Array();
//       for(let  i=start_time; i<=end_time; i = i+interval){
//       formatted_time = convertHours(i);
//       time_slots.push(formatted_time);
//     }
//     return time_slots;
// }
const calculate_time_slot = async(start_time,end_time,interval = "30") =>{
      try{
            //Times
            let allTimes = [];

            //Loop over the times - only pushes time with 30 minutes interval
            while (start_time < end_time) {
                  //Push times
                  allTimes.push(start_time); 
                  //Add interval of 30 minutes
                  start_time.add(interval, 'minutes');
            }
            return allTimes ;
      }catch(error){
            throw error ;
      }
}
const  getTimeFromMins = async(mins) =>{
      // do not include the first validation check if you want, for example,
      // getTimeFromMins(1530) to equal getTimeFromMins(90) (i.e. mins rollover)
      if (mins >= 24 * 60 || mins < 0) {
          throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
      }
      var h = mins / 60 | 0,
          m = mins % 60 | 0;
      return moment.utc().hours(h).minutes(m).format("hh:mm A");
  }


const check_email = async(email) => {
  try {

        let query = { email : email.toLowerCase() , isDeleted : false }
        let projection = { _id : 1 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.artsDetails, query, projection, options)

        return fetch_data

  }
  catch(err) {
        throw err;
  }
}

const check_user = async(userid) => {
  try {

        let query = { _id : userid , isDeleted : false }
        let projection = {__v : 0 }
        let options = { lean : true }
        let fetch_data = await DAO.getData(Models.users, query, projection, options)

        return fetch_data
  }
  catch(err) {
        throw err;
  }
}


const check_bnk_acct_num = async(acctNum) => 
{
      try{
            let Model = Models.bankAccounts ;
            let query = {
                  account_number : acctNum,
                  isDeleted : false
            }
            let projction = {__v : 0} ;
            let options = {lean : true} ;
            let check_data = await DAO.getData(Model,query,projction,options);
            return check_data ;
      }catch(err){
            throw err ;
      }

}



const check_user_member_ship = async(studioId) => {
      try {
    
            let query = { 
                 $and:[
                    { studioId : studioId },
                    { memberPlanId :{$ne : null}}
                 ], isDeleted : false }
            let projection = {__v : 0 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.users, query, projection, options)
            let users_data = []
            if(fetch_data.length != 0){
                  let date = new Date(new Date().setHours(05, 30, 0, 0)).getTime();
                  for(let i = 0;i<fetch_data.length;i++ ){

                        if(fetch_data[i].membershipDate > date ){
                              users_data.push(fetch_data[i])
                        }
                        else{

                              fetch_data[i]
                              let query = {_id : fetch_data[i]._id }
                              let update = {
                                    memberPlanId : null,
                                    memberShipeExpired : false,
                                    membershipDate :  null,
                                    memberShipe : false
                              }
                              let update_user = await DAO.findAndUpdate(Models.users,query,update,{new: true})
                        }
                  }

            }
            return users_data
      }
      catch(err) {
            throw err;
      }
}

const search_user = async(search) => {
      try {
    
            let query = { name : {$regex :search, $options : "i"} , isDeleted : false }
            let projection = {_id : 1, name : 1, profilePicture :1, email :1 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.users, query, projection, options)
            return fetch_data
      }
      catch(err) {
            throw err;
      }
    }

const getUser = async (mobileNo) => {
  
    let query ={
      mobileNo : mobileNo,
      isBlocked :  true 
    }
    let projection = {__v : 0 };
    let option = {lean : true};
    let fetch_data = await DAO.getData(Models.users,query,projection,option)
    return fetch_data;
};

const policy_terms_condtions = async() => {
      try {

            let query = { 
                  isDeleted : false 
            }
            let projection = { _id : 0, policy : 1,termsCondition : 1 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.policyTermConditions, query, projection, options)
            return fetch_data
      }
      catch(err) {
            throw err;
      }
}

const check_user_phone_no = async(CountryCode, mobileNumber) => {
      try {

            let query = { 
                  CountryCode : CountryCode, 
                  mobileNumber : mobileNumber, 
                  isDeleted : false 
            }
            let projection = { _id : 1 }
            let options = { lean : true }
            let fetch_data = await DAO.getData(Models.users, query, projection, options)

            return fetch_data

      }
      catch(err) {
            throw err;
      }
}

const update_data = async(token_info) => {
      try {
    
              let query = {
                    _id : token_info._id,
              }
              let update = {isSetPassword : true, otpVerified : true }
              let options = { new : true}
              let data_to_update = await DAO.findAndUpdate(token_info.collection, query, update, options)
              return data_to_update
    
    
      }
      catch(err) {
            throw err;
      }
    
};


const check_mobileNumber = async(contactNumber) => {
      try {
            let query = {
                  contact_number : contactNumber,
            }
            let projection = {_id : 1 }
            let options = { lean : true}
            let fatch_data = await DAO.getData(Models.users,query,projection,options)
            return fatch_data
    
      }
      catch(err) {
            throw err;
      }
    
};

const upcomingCallsDate = async(expertId)=> {
      try{
            let Model = Models.calls_scheduling ;
            let query = {
                  expertId : expertId,
                  video_call_status : "Upcoming" ,
                  isCancelled : false,
            } ;
            let projection = {__v : 0} ;
            let options  = {lean : true} ;
            let getAllCall = await DAO.getData(Model,query,projection,options) ;
            // console.log(" count of  all calls",getAllCall) ;
            let count = getAllCall.length ;
          
            return count ;

      }catch(err){
            throw err ;
      }
};
const getTotalUsers = async(userData) => {
    try{
        let Model = Models.ratings_reviews ;
        let  query = {
            review_to : userData._id ,
            isDeleted : false
        } ;
        let projection =  {__v : 0};
        let options = {lean : true} ;
        let getAllReviewers = await DAO.getData(Model,query,projection,options) ;
        let couunt = getAllReviewers.length ;
        return couunt ;
    }  catch(err){
        throw err ;
    }
} ;
const getTotalUsers1 = async(reviewId) => {
      try{
          let Model = Models.ratings_reviews ;
          let  query = {
            review_to : reviewId ,
            isDeleted : false
          } ;
      //     console.log('query.........',query) ;
          let projection =  {__v : 0};
          let options = {lean : true} ;
          let getAllReviewers = await DAO.getData(Model,query,projection,options) ;
          let couunt = getAllReviewers.length ;
          return couunt ;
      }  catch(err){
          throw err ;
      }
  } ;

const getRatingUsers = async(userData) => {
      try{
          let Model = Models.ratings_reviews ;
          let  query = {
              review_to : userData._id ,
              isDeleted : false
          } ;
          let projection =  {__v : 0};
          let options = {lean : true} ;
          let getAllReviewers = await DAO.getData(Model,query,projection,options) ;
         
          return getAllReviewers ;
      }  catch(err){
          throw err ;
      }
  } ;

const SevenDayCallCount = async(expertId) =>{
    try{
            let current_date = moment().format('x');
            // console.log("current_date is her e",current_date);
            let sevenDays = moment().add(7,'d').format('x'); 
            //   console.log("sevend days  is hwre ",sevenDays) ;
            let Model = Models.calls_scheduling ;
            let query = {
                  date : {$lt : sevenDays},
                  
                  expertId : expertId ,
                  // rating_stars : {$nin :[0] },
                  
                  video_call_status : "Upcoming" ,
                  live_video_call_status : "Pending",
                  
                  isCancelled : false,
            } ;
            let projection = {__v : 0};
            let options = {new : true} ;
            let  fetch_data = await DAO.getData(Model,query,projection,options) ;
            console.log("fetch_data  of seven days ======>>>>>>",fetch_data ) ; 
            let count = fetch_data.length ;
     
        return count ;
      }catch(err){
            throw err ;
      }

};
const totalExpertCalls = async(expertId) => {
      try{
            let Model = Models.calls_scheduling ;
            let query = {
                  $or : [
                        { 
                              expertId :  expertId 
                        },
                        { 
                              userId : expertId
                        },
                              
                  ],
                  live_video_call_status : "Completed",
                  live_video_call_status : "Completed",
                  isDeleted : false,
                  isCancelled : false
            };
            let proejction = { __v : 0 } ;
            let optons = { lean : true } ;
            let fetch_data = await DAO.getData(Model,query,proejction,optons) ;
            return fetch_data.length  ;
      }catch(err){
            throw err ;
      }
}
const reviewTotalCounts = async(review_to) => {
      try{
            let Model = Models.ratings_reviews ;
            let query = {
                  review_to : review_to,
                  rating_stars : {$nin : [0]},
                  isDeleted : false
            };
            let projection = {__v : 0} ;
            let options = {lean : true} ;
            let fetch_dta = await DAO.getData(Model,query,projection,options) ;     
            let count = fetch_dta.length ;
            // console.log("total review counts",count) ;
            return count ;
      }catch(err){
            throw err ;
      }
};


const pastSevenDayReviews = async(review_to) => {
    try{
        let Model = Models.ratings_reviews ;
        let past_seven_days =  moment().subtract(7,'d').format('x') ;
        let query = {
            review_to : review_to,
            rating_stars : {$nin : [0]},
            review_date : {$gte : past_seven_days },
            isDeleted : false
        } ;
        let fetch_data = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
        let count = fetch_data.length  ;
      //   console.log("total seven day review counts",count) ;

        return count ;
      }catch(err){
            throw err ;
      }
};


const check_monthly_earnings = async(userData) =>{
      try{
            let Modle = Models.payment_locks ;
            let current_date = moment().format('x') ;
            let last_one_month = moment().subtract(1,"M").format('x') ;
            let start_date = moment(current_date,"YYYY/MM/DD").startOf('month').format("YYYY/DD/MM") ;
            let end_date = moment(current_date,"YYYY/MM/DD").endOf('month').format("YYYY/DD/MM") ;

            // let query = {
            //       recieverId : userData._id,
            //       payment_date : {$gt : last_one_month} ,
            //       // month_ammount : {$sum : [ $ammount ]},
            //       ammount_status : 'Credit'
            // } ;

            let match = {
                  $match : {
                        recieverId :  mongoose.Types.ObjectId(userData._id),
                        payment_date:   { $gte : [start_date,end_date] },
                        ammount_status : 'Credit',
                        isDeleted  : false,

                  }
            }
           
            let group = {
                  $group: { 
                        "_id"  : "$recieverId" /*"$_id"*/,
                        count:{$sum : 1},
                        monthly_ammount : { $sum  : "$amount" },
                        
                  }
            } ;
            console.log('console on group',group) ;
            let project = {
                  $project : {
                        recieverId : 1,
                        payment_date : 1,
                        monthly_ammount : 1
                  }
            } ;
            console.log('console on project',project) ;

            let options = {new : true} ;
            let aggregaye_data = [match,group,project] ;
            let get_details = await DAO.aggregatedata(Modle,aggregaye_data) ;
            console.log("get_details.....>",get_details) ;
            return get_details ;
            
      
            
                  // ... $project: {
                  //    ... _id: 0,
                  //    ... "TotalAmount": '$Amount'
                  // ... }
                    
            // let get_details = await DAO.getData(Modle,query,{__v  : 0},{lean : true}) ;
            // console.log("get_details of one moth earnings ",get_details) ;
            // return get_details ;
            // // if(get_details.length != 0) {

            // }

      }catch(err){
            throw err ;
      }

} ;

const check_next_seven_days_earnings = async(userData) => {
      try{
            let Model = Models.calls_scheduling ;
            let next_one_week = moment().add(7,'d').format('x') ;
            let query = {
                  expertId : userData._id,  
                  date : {$lte : next_one_week },
                  video_call_status : "Upcoming" ,
                  isCancelled : false,
            } ;
            let get_data = await DAO.getData(Model,query,{pre_authorisation_amount : 1},{lean : true}) ;
            let result = 0 ;
             if(get_data.length != 0) {
                  for(let data of get_data){
                        let next_seven_day_earning = data.pre_authorisation_amount ;
                        
                        result +=  next_seven_day_earning ;
                  }   
            }
            // console.log("-------result.toFixed(2--------------",result.toFixed(2)) ;
            return result.toFixed(2) ;
      }catch(err){
            throw err  ;
      }
} ;
const check_next_month_earnings1 = async(userData) => {
      try{
            let Model = Models.calls_scheduling ;
            let next_one_month = moment().add(1,"M").format('x') ;
            let query = {
                  expertId : userData._id,  
                  date : {$lte : next_one_month },
                  video_call_status : "Upcoming" ,
                  isCancelled : false,
            } ;

            let get_data = await DAO.getData(Model,query,{pre_authorisation_amount : 1},{lean : true}) ;

            let result = 0 ;
             if(get_data.length != 0) {
                  for(let data of get_data){
                        let next_month_earning = data.pre_authorisation_amount ;
                        console.log("-------->",next_month_earning)
                        
                        result +=  next_month_earning ;
                  }   
            } ;

            return result.toFixed(2) ;
      }catch(err){
            throw err  ;
      }
} ;


const check_monthly_earnings1 = async(userData) => {
      try{
            let Model = Models.payment_locks ;
            let last_one_month = moment().subtract(1,"M").format('x') ;
            let query = {
                  recieverId : userData._id,          
                  ammount_status : 'Credit',
                  payment_date : {$gt : last_one_month} ,
            } ;
            let get_data = await DAO.getData(Model,query,{ammount : 1},{lean : true}) ;
            let result = 0 ;
             if(get_data.length != 0) {
                  for(let data of get_data){
                        let month_earn = data.ammount ;
                        // console.log("month_earn....",month_earn) ;
                        result +=  month_earn ;
                  }   
            }
            // let totalAmount =  { $sum : get_data.ammount  } ;
            return result.toFixed(2) ;
      }catch(err){
            throw err  ;
      }
} ;
const time__Convert = async (n, n1, date, cuurent_date) => {
      try {

            let oldDate = moment(date).format('x')
            let newDate = moment().startOf("day").add('minute', n1).format('x')
            console.log("oldDate",oldDate,"newDate",newDate)
            var secounds = moment(oldDate, "x").diff(moment(newDate, "x"), "millisecond");
            // let miliseonds = moment(duration).format('x')
            console.log("secounds",secounds)
            return { Seconds: secounds };

      } catch (err) {
            throw err
      }
}

const check_yearly_earnings1 = async(userData) => {
      try{
            let Model = Models.payment_locks ;
            let last_one_year = moment().subtract(1,"Y").format('x') ;
            let query = {
                  recieverId : userData._id,          
                  ammount_status : 'Credit',
                  payment_date : {$gt : last_one_year} ,
            } ;
            let get_data = await DAO.getData(Model,query,{ammount : 1},{lean : true}) ;
            let result = 0 ;
             if(get_data.length != 0) {
                  for(let data of get_data){
                        let month_earn = data.ammount ;
                        // console.log("month_earn....",month_earn) ;
                        result += month_earn  ;
                  }
                  
            }
            // let totalAmount =  { $sum : get_data.ammount  } ;
            return result.toFixed(2) ;
      }catch(err){
            throw err  ;
      }
}
const check_favourite_experts = async(favoriteId,userId) => {
    try{
        let Model = Models.favourite_experts ;
        let query = {
            favoriteId :  favoriteId,
            userId : userId,
            isDeleted : false,
        } ;
        let proejction = {__v : 0} ;
        let options = {lean : true} ;
        let fetch_result = await DAO.getData(Model,query,proejction,options) ;
        return fetch_result ;
    }catch(err){
        throw err ;
    }
};
const check_user_slot_date  = async(startDate,userdata,availability) => {
    try{
        // user_slots model
        let Model = Models.user_slots ;

        let query = { 
            userId : userdata._id,
            startDate_extra : {$lte : startDate} ,
            endDate_extra :  {$gte : startDate},
         
        } ;
        if(availability){
              query.availability = availability
              
        }
        let proejrction = { __v  : 0 } ;
        let options = { lean :  true } ;
        let check_data = await DAO.getData(Model,query,proejrction,options) ;
        return check_data ;
    }catch(err)
    {
        throw err ;
    }
} ;


const check_user_slot_date_string  = async(startDate,userdata,availability) => {
    try{
        // user_slots model
        let Model = Models.user_slots ;

        let query = { 
            userId : userdata._id,
            startDateString : startDate,
            // endDateString : {$gte : startDate}
        } ;
       
        let proejrction = { __v  : 0 } ;
        let options = { lean :  true } ;
        let check_data = await DAO.getData(Model,query,proejrction,options) ;
        return check_data ;
    }catch(err)
    {
        throw err ;
    }
};
const check_category_name = async(name,userData) => {
    try {
        let Model = Models.categories ;
        let query = {
            userId : userData._id,
            name : name,
            isDeleted : false,
        }
        let projection = {__v : 0 } ; 
        let options = { lean : true} ;
        let fatch_data = await DAO.getData(Model,query,projection,options);
        return fatch_data ;

    }
    catch(err) {
        throw err;
    }
};

// const managed_timing = async(startTime) => {
//       try {
 
//            //###--------get mintues from time
//            let tempTime1 = moment.duration(startTime);
//            let minutes =  tempTime1.minutes();

//            //###--------get hours from time and convert in minutes
//            let tempTime = moment.duration(startTime);
//            let hours1 =  tempTime.hours();
//            let hours = hours1 * 60;   

//             return {
//                   Time : minutes+hours,
//             }

//       }
//       catch(err) {
//             throw err;
//       }
// }



const check_user_name = async(Id) => {
      try { 
            
        let query = { isDeleted: false, _id: Id};
        let options = {lean : true};
        let projections = {__V : 0};
        let listdata = await DAO.getData(Models.users, query, projections, options);
        return listdata
      }
      catch(err) {
            throw err;
      }
};
const user_media_count = async (id) => { 
    try {
        console.log("id=======>",id) ;
        let Model = Models.medias ;
        let query = {
            userId : id,
            isDeleted : false,
        } ;
        let projection = {
            images : 1,
            videos : 1
        }; 
        let options  = { lean : true }  ;
        let fetch_details = await DAO.getData(Model,query,projection,options ) ;
        console.log("fetch_details=======>",fetch_details) ;
        let counts = fetch_details.length ;
        console.log("counts=======>",counts) ;
        return counts ;
    }catch (err) 
    {
        throw err ;
    };
};

const save_notification = async(ids,data) => {
      try { //###----------current time -------
            time =  new  Date(Date.now()).getTime()
            let setData = { 
                    time : time,
                    recieverId : ids.recieverId,
                    senderId : ids.senderId,
                    message : data.message,
                    title : data.title,
                    type : data.type
            }
            if(ids.taskId){
                  setData.taskId  = ids.taskId

            }
      
            let fetch_data = await DAO.saveData(Models.notifications,setData)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
} 

const get_member_ship_user = async(date ,sessionName,studioId) => {
      try { 

            let get_user = await check_user_member_ship(studioId)

            if(get_user.length != 0){
                for(let i= 0;i<get_user.length;i++){

                  let get_token =  await get_user_token(get_user[i]._id)
                  console.log( "get device token ",get_token)
                  if(get_token != null){
                  data = {
                        title : "Admin add new session",
                        message : sessionName + " this is new session  create by admin start on "+date+" date " ,
                        type : "Session",
                      }
                      let push_notification = await push_notification_status(get_token, data)
                      //###-------save notification ------
                      let ids = {
                        recieverId : user_id,
                        senderId : sender_id,
                      }
                      let save_notif = await save_notification(ids, data);
                      console.log("save notifucation ", save_notification);
                  }
                }
            }
      }
      catch(err) {
            throw err;
      }
}

const get_group_data_user = async(sessionId,userId) => {
      try { 

            let query = {sessionId :sessionId,userId : userId, isDeleted: false  }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.sessionGroups,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}

const get_group_data = async(sessionId) => {
      try { 

            let query = {sessionId :sessionId, isDeleted: false  }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.sessionGroups,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}


const get_app_data = async(type) => {
      try { 

            let query = {type :type, isDeleted: false }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.appDatas,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}

const groupDataDetails = async() =>{
   try{
        let query = {isDeleted:{$ne:true}}
        let projection = { __v : 0};
        let options = {lean : true};
        let dataList = await DAO.getData(Models.groupDatas,query,projection,options);
        return dataList
        
    }catch(err){
        throw err;
    }
}

const get_likes = async(linkId,userId) =>{
      try{
           let query = {groupLiknkId : linkId, userId : userId}
           let projection = { __v : 0};
           let options = {lean : true};
           let dataList = await DAO.getData(Models.likeLinks,query,projection,options);
           return dataList
           
       }catch(err){
           throw err;
       }
}


const get_reports = async(linkId,userId) =>{
      try{
           let query = {groupLiknkId : linkId, userId : userId}
           let projection = { __v : 0};
           let options = {lean : true};
           let dataList = await DAO.getData(Models.reportLinks,query,projection,options);
           return dataList
           
       }catch(err){
           throw err;
       }
}

const get_current_date = async(date,startTime) =>{
      try{

    let cuurent_date = new Date(date).getTime();

      let newDate2 = 0
      let time = 0
      if(startTime){
        console.log("startTime ",startTime)
        time  = await timeConvert(startTime)

       let session = new Date(cuurent_date).toUTCString()
        console.log("session",session)
        let managedDate = new  Date(session).setHours(time.hours - 5,time.minutes - 30)
       let mydata = new Date(managedDate).getTime() 
       newDate2 = mydata 
       
      } 
       let today = new Date().setHours(05, 30 , 0 , 0)
       let newDate = new Date(cuurent_date).setHours(05, 30 , 0 , 0)
       let todayDate = new Date(today).getTime();
       
       console.log("currentDate", todayDate,"sessionDate",newDate,"currentTime",time,"sessionDateTime",newDate2)

        return {
              sessionDate : newDate,
              currentDate : todayDate,
              currentTime : time,
              sessionDateTime : newDate2
        }   
       }catch(err){
           throw err;
       }
}


const timeConvert = async(n) =>{
try{
      var num = n;
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      return {
            hours : rhours,
            minutes : rminutes
      }
}catch(err){
      throw err;
  }
}
  
const get_link_id = async(linkId) => {
      try { 

            let query = {linkId : linkId }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.linksDetails,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}



const check_link_upload = async(sessionId ,userId) => {
      try { 

            let query = {sessionId : sessionId ,userId :userId }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.uploadLinks,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}

const check_userId = async(id ,userId) => {
      try { 

            let query = {
                  $and : [{_id : id},{_id :userId}] }
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.users,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}


const get_plans_data = async(id ) => {
      try { 

            let query = {_id : id}
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.memberShipPlans,query,projection,option)
            return fetch_data

      }
      catch(err) {
            throw err;
      }
}
const timeConvert1 = async(n) =>{
try{
      let num = n;
      let hours = (num / 60);
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return`${rhours}:${rminutes}`
            // hours : rhours,
            // minutes : rminutes
      
}catch(err){
      throw err;
  }
}

const get_selected_card = async(userId ) => {
      try { 

            let query = {userId : userId}
            let projection = {__v : 0 }
            let option = {lean : true}
            let fetch_data = await DAO.getData(Models.selectedCards,query,projection,option)
            if(fetch_data.length != 0 ){
            let query1 = {_id : fetch_data[0].cardId }
            let get_card_data = await DAO.getData(Models.cards,query1,projection,option)
            return get_card_data
            }
            else{
                 throw ERROR.NO_ANY_CARD_EXSIST
            }

      }
      catch(err) {
            throw err;
      }
}
const managed_timing = async(time) => {
      try {
 
           //###--------get mintues from time
           let tempTime1 = moment.duration(time);
           
           let minutes =  tempTime1.minutes();
           console.log(" ==== minutes ========",minutes) ;

           //###--------get hours from time and convert in minutes
           let tempTime = moment.duration(time);
           let hours1 =  tempTime.hours();
           console.log(" ==== hours1 ========",hours1) ;

           let hours = hours1 * 60;   

            return  hours+minutes ;
            
            

      }
      catch(err) {
            throw err;
      }
}

const save_clone_session = async(allData) => {
      try { 
            let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let d = new Date();
            let number = d.getDay();
            let today = weekday[number]
            
            let newdate = new Date(Date.now()).getTime();
            let timeZone_date = new Date(newdate).toLocaleString("en-US", { timeZone: "Pacific/Chatham" });

            let date = new Date(newdate).setHours(05, 30 , 0 , 0)

            let setData = {
                  thisId: allData._id ,
                  name: allData.name,
                  title: allData.title,
                  days : today,
                  date : date,
                  offsetType : allData.offsetType,
                  offset : allData.offset, 
                  startTime : allData.startTime,
                  timeZone: allData.timeZone,
                  startTimeType :allData.startTimeType ,
                  uploadTime :allData.uploadTime,
                  engageStartTime: allData.engageStartTime,
                  discription:allData.discription
            } 
            let save_data = await DAO.saveData(Models.cloneSessions,setData)
            return save_data 

      }
      catch(err) {
            throw err;
      }
};

const user_info = async(userId) => {
      try{
            let condition = {
                  _id : userId._id,
                  isDeleted : false
            } ;
            let fetch_data = await DAO.getData(Models.users,condition,{ __v : 0 },{ lean : true } ) ;
            return fetch_data ;
      }catch(err){
            throw err  ;
      }
} ;

// total_amount,fectth_balance,deducted_money, fetch_vendor_stripeid, metaData 

const create_payment_intent = async(amount,fectth_balance,deducted_money,fetch_vendor_stripeid,meta_data) => {
      try {

            console.log("---------------create_payment_intent---",amount)


            let new_amount = parseFloat(amount)  ;

            let final_ammount = new_amount * 100 ;
            let fixed_amount = parseInt(final_ammount) ;
            console.log("---------------fixed_amount---",fixed_amount)

            let payment_intent = await stripe.paymentIntents.create({
                  amount : fixed_amount ,
                 
                  currency : 'usd',
                 
                  payment_method_types : ['card'],
                 
                  capture_method : 'manual',
                 
                  metadata : meta_data,

                  description : "Payment Intent for " + meta_data.userName ,

                  customer : fectth_balance.customerId,
                  
                  payment_method: fectth_balance.cardId,

                  confirm : true,
                  
                  application_fee_amount : deducted_money * 100,
                  
                  transfer_data: {
                        destination : fetch_vendor_stripeid,
                  }
           

            });
     
            console.log("--------- payment_intent -------",payment_intent)

            return {
                  id : payment_intent.id,
                  amount : amount.toString(),
                  currency : payment_intent.currency,
                  description  : payment_intent.description,
                  meta_data : payment_intent.metadata,
                  client_secret : payment_intent.client_secret,
                  next_action: payment_intent.next_action,
                  status: payment_intent.status,
                  customer : payment_intent.customer
            }

      }
      catch(err) {
            throw err;
      }
};

const retrieve_payment_intent = async(data) => {
      try{
            
            const paymentIntent = await stripe.paymentIntents.retrieve(data) ; 
            
            return paymentIntent ;
      }catch(err){
            throw err ;
      };
};

const create_payment_intent_without_application_amount = async(amount,fectth_balance,meta_data) => {
      try {

            console.log("---------------create_payment_intent---",amount)


            let new_amount = parseFloat(amount)  ;

            let final_ammount = new_amount * 100 ;
            let fixed_amount = parseInt(final_ammount) ;
            console.log("---------------fixed_amount---",fixed_amount)

            let payment_intent = await stripe.paymentIntents.create({
                  amount : fixed_amount ,
                 
                  currency : 'usd',
                 
                  payment_method_types : ['card'],
                 
                  capture_method : 'manual',
                 
                  metadata : meta_data,

                  description : "Payment Intent for " + meta_data.userName ,

                  customer : fectth_balance.customerId,
                  
                  payment_method: fectth_balance.cardId,

                  confirm : true,
                  
                 
           

            });
     
            console.log("--------- payment_intent -------",payment_intent)

            return {
                  id : payment_intent.id,
                  amount : amount.toString(),
                  currency : payment_intent.currency,
                  description  : payment_intent.description,
                  meta_data : payment_intent.metadata,
                  client_secret : payment_intent.client_secret,
                  next_action: payment_intent.next_action,
                  status: payment_intent.status,
                  customer : payment_intent.customer
            }

      }
      catch(err) {
            throw err;
      }
};


const tranfer_ammount_to_bank_account = async(data) => {
      try{
            let total_mney = data.ammount ;
            console.log("total_mney ====>",total_mney) ;

            // let new_amount = total_mney  ;


            let fixed_amount = parseInt(total_mney * 100) ;

            let bank_account_id = data.bankId ;


            const payout = await stripe.transfers.create({
                  amount: fixed_amount ,
                  currency: 'usd',
                  destination : bank_account_id 
            });


            return payout ;

      }catch(err){
            throw err ;
      }
};

const capture_funds = async(data) => {
      try {
            
            let payment_intent_id = data.payment_intent_id ;

            console.log("payment_intent_id ====>",payment_intent_id) ;
            
            let total_mney = data.total_amount ;
            
            console.log("total_mney ====>",total_mney) ;

            // let new_amount = total_mney 
            let fixed_amount = parseInt(total_mney * 100) ;

            console.log("final ammount after paring amount ----",fixed_amount) ;

            let updated_commision = data.deductedAmmount * 100 ;

            console.log("updated_commision is heere ------->",updated_commision) ;


            let vendor_id =  data.vendorId ;

            console.log("Chcek vendor id heere ------->",vendor_id) ;

           
            let minimum_ammount = 50  ;

            let final_ammount = Math.max(minimum_ammount,fixed_amount) ;

            console.log("final_ammount is heere ------->",final_ammount) ;
            

            let intent ;

            if(vendor_id == "" || vendor_id == undefined ){
                  intent = await stripe.paymentIntents.capture(payment_intent_id, {
                        amount_to_capture : final_ammount,
                  })
                  console.log("---------intent without vendor ------------",intent) ;
            
                  // return intent ;

            }else{
                  let retrieve_vendor = await retrieve_stripe_vendor_id(vendor_id) ;

                  if(retrieve_vendor.capabilities.transfers != "active"){


                        intent = await stripe.paymentIntents.capture(payment_intent_id, {
                              amount_to_capture : final_ammount,
                        })
                        console.log("---------intent without vendor ------------",intent) ;
                  }else{

                        intent = await stripe.paymentIntents.capture(payment_intent_id, {
                              amount_to_capture : final_ammount,
                              application_fee_amount : parseInt(updated_commision),
                              // transfer_data : {
                              //       destination : vendor_id ,
                              // }
                        }) ;
                        
                        console.log("---------intent with vendor ------------",intent) ;

                  }

            
                    
                  // return intent

            }
            return intent  ;
           

      }
      catch(err) {
            throw err;
      }
};

const confirm_payment_intent = async(data) => {
      try{
            let payment_intent_id = data.payment_intent_id ;
            let total_mney = data.total_amount ;
            console.log("total_mney to confirm ====>",total_mney) ;

            let new_amount = total_mney 
            let fixed_amount = parseInt(total_mney)


            // const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id,{
            //       amount_to_confirm  : fixed_amount
            // }) ;
            // const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id) ;
            const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id);

            return paymentIntent ;
      }catch(err){
            throw err ;
      }
};


const refund_intent = async(data) => {
      try {
            let intent_id = data.payment_intent_id ;
            let ammount = data.ammount  ;

            const refund = await stripe.refunds.create({
                  payment_intent : intent_id,
                  amount: ammount * 100 ,
            });

            // let cancel = await stripe.paymentIntents.cancel(payment_intent_id) ;
            return refund ;

      }
      catch(err) {
            throw err;
      }
};

const payout_intent = async(data) => {
      try {
            console.log("data of tranferr controller ------",data) ;
            // #### - ammount to pay 
            let money = data.ammount ;
            // ### ---- vendorStripeId
            let stripeId = data.vendorStripeId 


            let fixed_amount = money * 100 ;

            console.log("transfer fund ammount ----->",fixed_amount) ;

            const transfer = await stripe.transfers.create({
                  amount: parseInt(fixed_amount) ,
                  currency: "usd",
                  destination: stripeId
            });

            return transfer ;

      }
      catch(err) {
            throw err;
      }
};

const deducting_eighty_percent_money = async(data) =>{
      try{

            let ammount =  data;

            let return_result = 80 * ammount / 100 ;

            console.log("return_result of 80 % ",return_result) ;

            return return_result ;
      }catch(err){
            throw err  ;

      }
};

const deducting_twenty_percent_money = async(data) =>{
      try{
            let ammount =  data;

            let return_result = ammount * 0.2 ;
          
            let final_result = parseInt(return_result) ;
          
            console.log("final_result of 20 % ",final_result) ;

            return return_result ;
      }catch(err){
            throw err  ;
      };
};

const retrieve_stripe_vendor_id = async(data) =>{
      try{
            const account = await stripe.accounts.retrieve(data);
            return account ;
      }catch(err){
            throw err ;

      };
};

const cancel_intent = async(payment_intent_id) => {
      try {
            let cancel = await stripe.paymentIntents.cancel(payment_intent_id) ;
            return cancel ;
      }
      catch(err) {
            throw err;
      };
};

const generate_twillio_access_token = async(data,userData) => {
      try{
            console.log("Twillio-----",twillio) ;
            let current_time = moment().format('x')
            // Create Video Grant
            const videoGrant = new VideoGrant({
                  room : 'Tellio-Room ' + data ,
            });
            console.log("identity names are here --->>>",userData) ;
            // Create an access token which we will sign and return to the client containing the grant we just created
            
            const token = new AccessToken(
                  twillio.TWILIO_ACCOUNT_SID,
                  twillio.TWILIO_API_KEY,
                  twillio.TWILIO_API_SECRET,
                  {
                        identity: userData,
                        ttl : 7200,
                        nbf : current_time
                  }
            );
            token.addGrant(videoGrant);
            console.log("------ token----------- rooom name ",token) ;
            let generated_token = token.toJwt() ;

            console.log("------------- generated_token -----------------",generated_token)

            return generated_token ;

      }catch(err){
            throw err ;
      }
};


const generate_otp = async() => {
      try{
            return 123456 ;
      }catch(err){
            throw err ;
      }
};

const generate_random_string =  async()   => {
      try{

            let random_string = randomstring.generate(10) ;
            return random_string
      }catch(err){
            throw err ;

      }
};

const chcek_refferal_code_exists = async(data) =>{
      try{
            let Model = Models.users ;

            let query = {
                  tones_referal_code : data
            } ;
           
            let projection = {__v : 0} ;
           
            let options = {lean : true } ;

            let fetch_details = await DAO.getData(Model,query,projection,options) ; 
            
            return fetch_details ;
      }catch(err){
            throw err ;
      }
};

const check_exist_status = async(data) => {
      try{    
            let query =  { 
                  name : data
            };
            let projection = { name : 1} ;
            let options = {lean : true } ;

            let fetch_details = await DAO.getData(Models.status,query,projection,options) ;
            return fetch_details ;
      }catch(err){
            throw err ;
      };
};

const check_email_validation = async(emailAdress)=>{
      try{
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            if (emailAdress.match(regexEmail)){
                  return {
                        result : true
                  }
            } else {
                  return {
                        result : false
                  }
            }
      }catch(err){
            throw err ;

      }
};

const check_compny_and_address_exist = async(compny,address) => {
      try{
            let Model = Models.company_channels ;
            let query = {
                  company_id : compny,
                  compny_address_id  : address
            };
            let prjection = {
                  company_id : 1,
                  compny_address_id : 1
            };
            let option = { lean : true } ;

            let all_fetched_data = await DAO.getData(Model,query,prjection,option) ;
            return all_fetched_data ;
      }catch(err){
            throw err ;
      }
};
const channel_details = async(compny,address) =>  {
      try{
            let query = {
                  company_id : compny ,
                  compny_address_id : address ,
            };
            let options = {lean : true } ;
            let fetch_all_data = await DAO.getData(Models.company_channels,query,{ _id : 1},options) ;
            return fetch_all_data ;
      }catch(err){
            throw err ;
      }
}

// const check_email_exist_in_company_and_address = async(emailId,compny,address) =>{
//       try{
//             let query = {
//                   company_id : compny ,
//                   compny_address_id :address,
//                   email : emailId
//             };
//             let proejction = { company_id : 1,compny_address_id : 1,email : 1 }  ;
//             let optiosn = {lean : true } ;
//             let fetch_all_details = await DAO.getData(Models.)

            
//       }catch(err){
//             throw err ;
//       }
// }


const save_data_invite = async(payload_data) =>{
      try{
         
      }catch(err){
            throw err ;
      }
}


const case2 = async(payload_data) =>{
      try{
            let query = {
                  company_id : payload_data.company_id,
                  compny_address_id : payload_data.compny_address_id,
                  is_deleted : false
            };
            let proejction = { _id : 1 }  ;
            let optiosn = {lean : true } ;
            let fetch_all_details = await DAO.getDataOne(Models.invite_members,query,proejction,optiosn)
            if(fetch_all_details != null ){

                  await case3(payload_data) ;
            }
            // else{
            //       await case4(data_to_validate) ;
            // }
      }catch(err){
            throw err ;
      };
};
const case3 = async(data_to_validate)=>{
      try{
            let query_for_chcek = {
                  company_id : data_to_validate.company_id,
                  compny_address_id : data_to_validate.compny_address_id,
                  email : {$in  : data_to_validate.email }
            };
            let projection = {_id : 1} ;
            let options = {lean : true } ;
            let fetch_all_data = await DAO.getData(Models.users,query_for_chcek,projection,options) ;
            if(fetch_all_data.length != 0){
                  throw ERROR.EMPLOYEE_ALREADY_EXISTS ;
            }else{
                
                let detail = await save_invited_members(data_to_validate) ;
                return detail;
            };
      }catch(err){
            throw err ;
      }
};

const case4 = async(data_to_validate) => {
      try{
            let query_for_chcek = {
                  company_id : data_to_validate.company_id,
                  email : {$in  : data_to_validate.email }
            };
            let projection = {_id : 1} ;
            let options = {lean : true } ;
            let fetch_all_data = await DAO.getData(Models.invite_members,query_for_chcek,projection,options) ;
            if(fetch_all_data.length != 0){
                  throw ERROR.EMPLOYEE_EXISTS ;
            }else{
                  
                  let datail = await save_invited_members(data_to_validate) ;
                  return detail ;
            }
      }catch(err){
            throw err ;
      };
};



const check_company_id = async(company_id) =>{
      try{
            let query = {
                  _id : company_id,
                  is_deleted : false
            };
            let proejction = { _id : 1 }  ;
            let optiosn = {lean : true } ;
            let fetch_all_details = await DAO.getDataOne(Models.companies,query,proejction,optiosn)
            return fetch_all_details ;
      }catch(err){
            throw err ;
      }
}

const check_company_address_id = async(company_address_id) =>{
      try{
            let query = {
                  _id : company_address_id,
                  is_deleted: false
            };
            let proejction = { _id : 1 }  ;
            let optiosn = {lean : true } ;
            let fetch_all_details = await DAO.getDataOne(Models.compny_address,query,proejction,optiosn)
            return fetch_all_details ;   

      }catch(err){
            throw err ;
      };
};

const check_payload_data_exist = async(payload_data) =>{
      try{
            let check_invite_data_query =  {
                  company_id : payload_data.company_id,
                  compny_address_id : payload_data.compny_address_id,
                  email : {$in : payload_data.email  } ,
            };
            let projection = {
                 _id : 1
            };
            let options = { lean : true } ;

            let match_data = await DAO.getData(Models.invite_members,check_invite_data_query,projection,options) ;
            return  match_data ;  
      }catch(err){
            throw err ;
      }
}

const if_data_validates_or_not = async(payload_data) =>{
      try{      
            let check_company = await check_company_id(payload_data.company_id) ;
            if(check_company != null){ 

                  let check_company = await check_company_address_id(payload_data.compny_address_id) ;
                  if(check_company != null){
                        let check_invite_data_query =  {
                              company_id : payload_data.company_id,
                              compny_address_id : payload_data.compny_address_id,
                              email : {$in : payload_data.email  } ,
                        };
                        let projection = {
                             _id : 1
                        };
                        let options = { lean : true } ;

                        let match_data = await DAO.getData(Models.invite_members,check_invite_data_query,projection,options) ;
                        if(match_data.length != 0){

                              throw ERROR.EMAIL_ALREADY_EXIST ;

                        }
                  }else{
                        throw ERROR.COMPANY_ADDRESS_NOT_EXISTS ;  
                  }
            }
            else{ 
                  throw ERROR.COMPANY_ID_NOT_EXISTS ;
            }
      }catch(err){
            throw err ;
      };
};

const create_new_user = async(payloadData) => {
  try{  
    let emials = payloadData.email.toLowerCase() ;
    let name = emials.slice(0, emials.lastIndexOf("@"));
    let create_user = {
      company_id : payloadData.company_id,
      full_name : name,
      compny_address_id : payloadData.compny_address_id,
      email : payloadData.email.toLowerCase(),
      is_user : true,
      password : md5("qwerty")
    };
    let user_data =  await DAO.saveData(Models.users,create_user) ;
    console.log("user_data ------saving ",user_data) ;
    return user_data ;
  }catch(err){
    throw err ;
  }
};

const save_invite_user = async(payloadData,user_id) => {
  try{
    
    let create_invite = {
          member_id : user_id,
          company_id : payloadData.company_id,
          compny_address_id : payloadData.compny_address_id,
          email : payloadData.email
    };
    let save_user = await DAO.saveData(Models.invite_members,create_invite) ;
  }catch(err){
        throw err ;
  }
};



const save_invited_members = async(data,userdata) => {
  try{
    let detail ;
    let emails = data.email;
    for(let data1 of emails) {
      let save_user_data = {
        email : data1,
        company_id : data.company_id,
        compny_address_id : data.compny_address_id,
      }
      console.log("save_user_data -----",save_user_data) ;
      let user_data = await create_new_user(save_user_data) ;
      console.log("user_data  -----",user_data) ;
      detail = await save_invite_user(save_user_data,user_data._id);
      console.log("detail  -----",detail) ;
      // save_member_in_channel = await save_members 
    };
//     let save_data = await get_channel_data(data,userdata) ;
    // return detail ;
  }catch(err){
    throw err ;
  }
};


const get_channel_data = async(data,userdata) => {
  try{
      let query = {
        company_id : data.company_id,
        compny_address_id : data.compny_address_id,
        is_deleted : false
      }
      let projection = { __v : 0}
      let option  = {lean : true}
      let match_data = await DAO.getData(Models.company_channels,query,projection,option) ;
      console.log("match_data -----<>>>",match_data) ;
      if(match_data.length != 0){
            for(let data1 of match_data){
                  let query = {
                        company_id : data.company_id,
                        compny_address_id : data.compny_address_id,
                        is_deleted : false
                  }
                  let projection = { _id : 1,member_id : 1}
                  let match_all = await DAO.getData(Models.invite_members,query,projection,option);
                  // let include_admin_id = match_all.push({ member_id : userdata }) ;
                  if(match_all.length != 0){
                        for(let data of match_all){

                              let query = {
                                    member_id : data.member_id,
                                    company_channels_id : data1._id,
                                    is_deleted : false
                              }
                              let projection = { _id : 1}
                              let match_invite_member = await DAO.getData(Models.channel_members,query,projection,option);
                              console.log("match_invite_member ----->>>",match_invite_member) ;
                              if(match_invite_member.length == 0){    
                                    let set_data = {
                                      member_id : data.member_id,
                                      company_channels_id : data1._id,
                                      company_id : data1.company_id,
                                      compny_address_id : data1.compny_address_id,
                                    }
                                    let match_invite_members = await DAO.saveData(Models.channel_members,set_data) ;
                                    console.log("match_invite_members ----->",match_invite_members) ;
                              }
                        }
                  }
            }
      }
  }catch(err){
    throw err ;
  }
};

const generate_qr_code = async(stringdata)=> {
      try{
            QRCode.toString(stringdata,{type:'terminal'}, function (err, url) {
                  if(err){
                       console.log("error occured",err);
                       return err ;
                  }else{
                        console.log("url",url) ;
                        // return url ;
                  };   
            });
      }catch(err){
            throw err ;
      };
};

const chck_if_user_exists = async(userId,blockId) => {
      try{
            let Model = Models.blocked_users ;
            let query = {
                  user_id : userId ,
                  blocked_id : blockId ,
                  is_deleted : false
            };
            let fetch_all_daya = await DAO.getData(Model,query,{ __v : 0 },{ lean : true });
            return fetch_all_daya ;
      }catch(err){
            throw err ;
      };
};

const blocked_users_list = async(userData)=> {
  try{
    let query = {
      user_id : userData._id,
      is_blocked : true,
      is_deleted : false
    }
    let fetch_data = await DAO.getData(Models.blocked_users,query,{__v : 0},{lean : true} ) ;
    return fetch_data ;
  }catch(err){
    throw err ;
  };
};

const blocked_users_list_in_chat = async(userData,id)=> {
  try{
    let query = {
      user_id : userData._id,
      blocked_id : id,
      is_blocked : true,
      is_deleted : false
    }
    let fetch_data = await DAO.getData(Models.blocked_users,query,{__v : 0},{lean : true} ) ;
    return fetch_data ;
  }catch(err){
    throw err ;
  };
};

const get_searched_users = async(payloadData,userData) => {
  try{
    let qyery = {
      full_name : {$regex : payloadData.search,$options : "i"},
      company_id : payloadData.company_id ,
      compny_address_id : payloadData.compny_address_id,
      isDeleted  : false,
      isBlocked : false,
    };
    let fetch_users = await DAO.getData(Models.users,qyery,{__v : 0},{lean : true}) ;
    if(fetch_users.length != 0){
      for(let data of fetch_users){
        data.type = "User" 
      }
    }
    return fetch_users ;
  }catch(err){
    throw err  ;
  };
};

const get_searched_channels = async(payloadData,userData)=>{
  try{
    let Model = Models.company_channels ;
    let query = {
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      channel_name : {$regex : payloadData.search,$options : "i"},
      is_deleted  : false
    };
    let fetch_alL_channel = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
    if(fetch_alL_channel.length != 0){
      for(let data of fetch_alL_channel){
        let fecth_members = await DAO.getData(Models.channel_members,{company_channels_id:data._id,is_deleted : false},{__v: 0},{lean : true}) ;
        data.members = fecth_members.length ;
        data.type = "Channel" ;
      };
    };
    return fetch_alL_channel ;
  }catch(err){
    throw err ;
  };
};

const get_meeting_data = async(payloadData,userData) => {
  try{
    let Model = Models.meeting_members ;
    let query1 = {
      member_id : userData._id,
      is_deleted : false
    };
    let fetch_assigned_task = await DAO.getData(Model,query1,{__v : 0},{lean : true}) ;
    if(fetch_assigned_task.length != 0){
      let meet_id_array = [] ;
      for(let task of fetch_assigned_task){
        meet_id_array.push(task.meeting_id) ;
      };
      let Model1 = Models.meetings ;
      let query = {
        _id : {$in : meet_id_array},
        company_id : payloadData.company_id,
        compny_address_id : payloadData.compny_address_id,
        title : {$regex : payloadData.search,$options : "i"},
        is_deleted  : false
      };
      let populate = [
        {
          path : "user_id",
          select : "_id full_name contact_number profile_picture email"
        }
      ]
      let fetch_meet = await DAO.populate_Data(Model1,query,{__v : 0},{lean : true},populate) ;
      // console.log("fetch_meet ---------",fetch_meet) ;
      if(fetch_meet.length != 0){
        for(let data of fetch_meet){
          data.type = "Meet" 
        };
      };
      return fetch_meet ;
    }
  }catch(err){
    throw err ;
  };
};

const get_poll_data = async(payloadData,userData) =>{
  try{
    let Model = Models.polls ;
    let query = {
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      question : {$regex : payloadData.search,$options : "i"},
      is_deleted  : false
    };
    let populate = [
      {
        path : "user_id",
        select : "_id full_name contact_number profile_picture email"

      }
    ]
    let fetch_poll = await DAO.populate_Data(Model,query,{__v : 0},{lean : true},populate) ;
    if(fetch_poll.length != 0){
      for(let data of fetch_poll){
        data.type = "Poll" 
      };
    };
    return fetch_poll ;
  }catch(err){
    throw err  ;
  };
};

const fetch_all_tasks = async(payloadData,userData) => {
  try{
    let Model = Models.tasks ;
    let query = {
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id,
      title : {$regex : payloadData.search,$options : "i"},
      is_deleted  : false
    };
    let populate = [
      {
        path : "user_id",
        select : "_id full_name contact_number profile_picture email"
      }
    ]
    let fetch_tasks = await DAO.populate_Data(Model,query,{__v : 0},{lean : true},populate) ;
    if(fetch_tasks.length != 0){
      for(let data of fetch_tasks){
        data.type = "Task" 
      };
    };
    return fetch_tasks ;
  }catch(err){
    throw err  ;
  };
};

const populate_task_members = async(data) => {
  try{
    let poulate = [
      {
        path : "member_id",
        select  :"_id full_name country_code contact_number profile_picture email"
      }
    ]
    let fetch_data  = await DAO.populate_Data(Models.tasks_members,{task_id : data._id,is_deleted : false},{__v : 0},{lean : true},poulate) ;
    return fetch_data ;
  }catch(error){
    throw error ;
    
  }
}
const list_polls = async(payloadData,userData) => {
  try{
    let userBlock = [] ;
    let fetch_blocked_users = await blocked_users_list(userData)  ;
    let fetch_member_query ;
    let query ;
    if(fetch_blocked_users.length != 0){
      for(let userBlocked of fetch_blocked_users){
        userBlock.push(userBlocked.blocked_id) ;
      } ;
    };
    console.log("userBlock ------",userBlock) ;
        let query_for_members  ;
        let members = [] /* variable used for condition in fetching members*/
        let conditions = {
              company_id : payloadData.company_id,
              compny_address_id : payloadData.compny_address_id,
              is_deleted : false
        };
        if(userBlock.length != 0){
          conditions.user_id = {$nin : userBlock} ;
        }
        // console.log("conditions ------",conditions) ;
        if(payloadData._id){
              conditions = {
                    _id : payloadData._id,
                    company_id : payloadData.company_id,
                    compny_address_id : payloadData.compny_address_id,
                    is_deleted : false
              };
              if(userBlock.length != 0){
                conditions.user_id = {$nin : userBlock} ;
              }    
        }
        let populate = [
              {
                    path : "user_id",
                    select : "_id isAvailable full_name profile_picture"
              }
        ];
        let fetch_all_polls = await DAO.populateData(Models.polls,conditions,{__v : 0},{ lean : true },populate) ;
        /**fetch all the users blocked by me**/
        let fetch_users = await blocked_users_list(userData);
        console.log("fetch Users in list polls---->>",fetch_users) ;
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
                    

                    if(members.length != 0){
                      query_for_members.member_id = {$nin : members}

                    }
                    console.log("query_for_members in polls-----",query_for_members) ;
                    /**** fetch all the members added in poll ***/
                    let populate_data = [
                      {
                        path :"member_id",
                        select  :"_id full_name country_code contact_number profile_picture email"
                      }
                    ]
                    let fetch_members = await DAO.getData(Models.polls_members,query_for_members,{__v : 0},{ lean : true }) ;
                    let populate_fetch_members = await DAO.populate_Data(Models.polls_members,query_for_members,{__v : 0},{ lean : true },populate_data) ;
                    console.log("populate_fetch_members-----",populate_fetch_members) ;
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
                               
                                let answer_responded = await DAO.getData(Models.polls_responses,{ answer_id : data1._id , poll_id : data1.poll_id ,respond_by : userData._id,is_deleted : false},{__v : 0},{lean : false}) ;
                             
                                data.responses = answer_responded  ;
                                console.log("data is here",data) ;
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

const unread_message_count = async(data,userData) =>{
  try{

                        let Model = Models.chats ;
                        let query = {
                              status_data : { $elemMatch: { is_deleted : false,user_id : userData._id, is_read : false  }},
                              is_deleted : false
                        };
                        if(data.sender_id != null && data.sender_id != undefined){
                              query.sender_id =  data.sender_id._id
                        };
                        if(data.reciever_id != null && data.reciever_id != undefined){
                              query.reciever_id =  data.reciever_id._id
                        };
                        
                        let get_data = await DAO.getData(Model,query,{_id : 1},{lean : true } );
                        let Count = get_data.length ;
                        console.log("Count ---------",Count) ;
                        return Count ;
  }catch(err){
    throw err ;
  }
};
const last_messages = async(payloadData,userData) => {
  try{
    let Model = Models.last_messages ;
    let query = {
      channel_id : payloadData.channel_id,
      is_deleted : false,

    };
    let fetch_details = await DAO.getData(Model,query,{_id : 1},{lean : true}) ;
    return fetch_details ;
  }catch(err){
    throw err ;
  };
};

const fetch_channel_members = async(payloadData) =>{
  try{
    let Model = Models.channel_members ;
    let query  = {company_channels_id : payloadData} ;
    let fetch_member = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
//     console.log("fetch_member ----------->",fetch_member) ;
    return fetch_member ;
  }catch(err){
    throw err ;
  };
};

const update_read_status = async(model,_id,userId)=>{
  try{
    console.log("model,_id,userId --------",model,_id,userId) ;
    let qery_data = {
      _id : _id,
      'status_data.user_id' : userId
    };
    let fetch_already_added_member = await DAO.getData(model,qery_data,{_id : 1},{lean : true}) ;
    if(fetch_already_added_member.length != 0){
      console.log("fetch_already_added_member is in if condition")
    }else{
      console.log("fetch_already_added_member is in else condition")
      let query = { _id : _id }; 
      let update3 = {
        $push : {
          status_data : { 
            is_read : "false" ,
            user_id : userId , 
          }
        } 
      };
      let update_details = await DAO.findAndUpdate(model,query,update3,{new : true }) ;
    }
  }catch(err){
    throw err ;
  }
};

const check_compny_adeess_exist = async(data)=>{
  try{
    let Model = Models.compny_address ;
    let query = {
      _id : data,
      is_deleted : false
    };
    let check_data = await DAO.getData(Model,query,{__v : 0},{lean : true}) ;
    return check_data  ;
  }catch(err){
    throw err ;
  }
};

const save_invited_members_to_specific_members = async(data,userId) => {
  try{
    let emails = data.email;
    for(let data1 of emails) {
      let save_user_data = {
        email : data1,
        company_id : data.company_id,
        compny_address_id : data.compny_address_id,
      }
      console.log("save_user_data -----",save_user_data) ;
      let user_data = await create_new_user(save_user_data) ;
      console.log("user_data  -----",user_data) ;
      let member_to_channel = await add_member_to_channel(data,user_data._id)
      // detail = await save_invite_user(save_user_data,user_data._id);
      // console.log("detail  -----",detail) ;
      // save_member_in_channel = await save_members 
    };
  }catch(err){
    throw err ;
  };
};
const add_member_to_channel = async(data,userid) => {
  try{
    let add_member = {
      company_channels_id : data.channel_id,
      member_id : userid,
      company_id : data.company_id,
      compny_address_id : data.compny_address_id
    };
    let sav_member = await DAO.saveData(Models.channel_members,add_member) ;

  }catch(err){
    throw err ;
  };
};

const fetch_unread_group_message = async(data,userData) =>{
  try{
    let query_for_chat = {
      channel_id : data.channel_id,
      is_deleted : false,  
      sender_id : {$nin : [userData._id]},
      status_data : { $elemMatch: { is_deleted : false,user_id : userData._id, is_read : false  }}
    };
    console.log("query_for_chat -----",query_for_chat) ;
    let fetch_count = await DAO.getData(Models.chats,query_for_chat,{__v : 0},{lean : true}) ;
    return fetch_count.length ;
  }catch(err){
    throw err ;
  };
};

const member_already_exist = async(memberId , data) => {
  try{
    let Model = Models.channel_members  ;
    let query = {
      company_channels_id,
      member_id : memberId,
      company_id : data.company_id,
      compny_address_id : data.compny_address_id
    };
    let check_data = await DAO.getData(Model,query,{_id : 1},{lean : true}) ;
    return check_data ;
  }catch(err){
    throw err  ;
  }
}
const fetch_names = async(data) => {
  try{
    let populate = [
      {
        path : "member_id",
        select  : "_id full_name"
      }
    ]
    let fetch_member = await DAO.populate_Data(Models.channel_members,{company_channels_id :data.channel_id ,is_deleted : false},{__v : 0},{lean : true},populate);
    let get_member = fetch_member.map(mem => {
      return mem.member_id.full_name
    }) ;
    return get_member ;
  }catch(err){
    throw err ;
  };
};

const fetch_meet_members = async(payloadData,userData)=> {
  try{
    let member_array  = [] ;
    let conditon  = {
      company_id : payloadData.company_id,
      member_id : userData._id,
      is_deleted : false,
      compny_address_id : payloadData.compny_address_id
    };
    let fetch_all_data = await DAO.getData(Models.meeting_members,conditon,{__v : 0},{lean : true}) ;
    if(fetch_all_data.length != 0){
      for(let data of fetch_all_data){
        member_array.push(data.meeting_id);
      };
    };
    return member_array ; 
  }catch(err){
    throw err ;
  };
};

const check_if_member_already_added = async(data,id,payloadData) => {
  try{
    let Model = Models.channel_members ;
    let condition = {
      company_channels_id : id, 
      member_id : data.member,
      company_id : payloadData.company_id,
      compny_address_id : payloadData.compny_address_id
    };
    let fetch_data = await DAO.getData(Model,condition,{__v : 0},{lean : true}) ;
    return  fetch_data ;
  }catch(err){
    throw err 
  };
};

const if_company_and_address_are_same = async(data) => {
  try{
    let Model = Models.compny_address  ;
    let qury = {  _id : data.company_address_id ,company_id : data.company_id ,is_deleted : false  }
    let fetch_detail = await DAO.getData( Model,qury,{ _id : 1 },{ lean : true } ) ;
    return fetch_detail ;
  }catch(err){ 
    throw err ;
  };
};

const get_voucher_data = async(data) =>{
  try{
    let Model = Models.vouchers ;
    let query ={
      _id : data.voucher_id 
    };
    let return_data = await DAO.getDataOne(Model,query,{__v : 0},{lean : true }) ;
    return return_data ;
  }catch(err){
    throw err ;
  };
};

const member_of_company_with_address = async(payloadData,userData,memberArray) =>{
  try{
    let Model = Models.users ;
    console.log("memberArray --->>",memberArray) ;
    console.log("payloadData --->>",payloadData) ;
    let qyery = {
      _id : {$nin : memberArray},
      isDeleted : false,
      isBlocked : false
    };
    if(payloadData.compny_address_id){qyery.compny_address_id = payloadData.compny_address_id };
    if(payloadData.company_id){qyery.company_id = payloadData.company_id };
    console.log("qyery --->>",qyery) ;
    let gwt_all_users  = await DAO.getData(Model,qyery,{__v : 0},{lean : true}) ;
    return gwt_all_users ;
  }catch(err){
    throw err ;
  }
};

const add_saved_message_data_in_chat = async(messageList,user_id)  =>{
  try{

    let Model = Models.saved_items ;
    if(messageList.length != 0){

                  for(let message of messageList){
                        message["message_saved"] = false 
                        let queries = {
                              message_id : message._id,
                              user_id : user_id,    
                              is_saved : true
                        }
                        let check_if_mesage_saved = await DAO.getDataOne(Model,queries,{_id : 1},{lean : true}) ;
             
                        if(check_if_mesage_saved != null){
                               message["message_saved"] = true 
                        }
                  
                  };
    };
    console.log("messageList ---->>>",messageList) ;
    return messageList ;
  }catch(err){
    throw err ;
  }
}
const wallet_ammount_of_user = async(user) =>{
  try{
    let total_ammount =  0 ; 
    let Model = Models.wallets ;
    let query = {
      status : "credit",
      user_id : user._id,
      is_deleted : false
    };
    let fetch_data = await DAO.getData(Model,query,{ammount : 1},{lean : true}); 
    console.log("fetch_data ----->>",fetch_data);
    if(fetch_data.length != 0){
      for(let data of fetch_data){
        total_ammount += data.ammount ;
      };
    };
    return total_ammount.toFixed(2) ;
  }catch(err){
    throw err ;
  };
};

const total_emoji_count = async(emojis) => {
  try{
    let Model = Models.chats ;
    let query ={
      reaction : {
        $elemMatch  : {
          emoji : emojis 
        }
      }
    };
    let count = Model.countDocuments(query) ;
    return count  ;
  }catch(err){ 
    throw err ;
  }
};

const is_alreay_reacted_on_message = async(payloadData,userData) =>{
  try{
    let Model = Models.chats ;
    let query ={
      _id : payloadData.message_id,
      reaction : {
        $elemMatch  : {
          emoji : payloadData.emoji,          
          user_id : {$in : [userData._id] }
        }
      }
    };
    let get_data = await DAO.getData(Model,query,{__v : 0},{lean : true }) ;
    console.log("get_data ---- 2836 ---",get_data) ;
    return get_data ;
  }catch(err){
    throw err ;
  }
};

const alreay_reaction_on_message = async(payloadData) =>{
  try{
    let Model = Models.chats ;
    let query ={
      _id : payloadData.message_id,
      reaction : {
        $elemMatch  : {
          emoji : payloadData.emoji,          
        }
      }
    };
    let get_data = await DAO.getData(Model,query,{__v : 0},{lean : true }) ;
    console.log("get_data ---- 2857 line  ---",get_data) ;
    return get_data ;
  }catch(err){
    throw err ;
  }
};

const uploadQrCode = async (params) => {
  try {
     

            console.log("....params..",params)

            const s3 = new AWS.S3({
                  bucket: aws3.bucket,
                  accessKeyId: aws3.accessKeyId,
                  secretAccessKey:aws3.secretAccessKey,
                  folder: {
                    profilePicture : "profilePicture",
                    thumb : "thumb"
                  }
            });
            const data = await s3.upload(params).promise()
            const { Location } = data
            return Location
  
  } catch (err) {
    throw err;
  }
}

// const set_star_for_saved_messges = async(return_save_messge,saved_message_data,userData) =>{
//   try{
//     if()

//   }catch(err){
//     throw err ;
//   }
// }


module.exports = {
  member_of_company_with_address : member_of_company_with_address,
  fetch_all_tasks : fetch_all_tasks,
  get_poll_data : get_poll_data,
  get_meeting_data : get_meeting_data,
  get_searched_channels : get_searched_channels,
  get_searched_users : get_searched_users,
  check_user_name : check_user_name,
  get_member_ship_user : get_member_ship_user,
  imageUpload: imageUpload,
  getUser:getUser,
  check_email:check_email,
  check_user:check_user,
  check_user_phone_no:check_user_phone_no,
  check_user_email:check_user_email,
  generate_token: generate_token,
  check_followers_id:check_followers_id,
  check_following_id : check_following_id,
  check_email_id:check_email_id,
  check_email_credendital_id:check_email_credendital_id,
  check_stripe_id :check_stripe_id,
  search_user:search_user,
  policy_terms_condtions : policy_terms_condtions,
  check_user_email_data:check_user_email_data,
  check_user_email_1:check_user_email_1,
  update_data : update_data,
  check_mobileNumber : check_mobileNumber,
  managed_timing : managed_timing,
  save_notification : save_notification,
  get_group_data : get_group_data,
  get_group_data_user : get_group_data_user,
  get_app_data : get_app_data,
  groupDataDetails : groupDataDetails,
  get_likes : get_likes,
  get_current_date : get_current_date,
  timeConvert : timeConvert,
  get_link_id : get_link_id,
  check_link_upload :check_link_upload,
  check_userId : check_userId,
  get_plans_data : get_plans_data,
  get_selected_card : get_selected_card,
  save_clone_session : save_clone_session,
  get_reports : get_reports,
  social_key_exists:social_key_exists,
  check_feed_id : check_feed_id,
  check_user_type : check_user_type,
  check_post_id : check_post_id,
  check_viewer_id : check_viewer_id,
  check_user_email_exist : check_user_email_exist,
  check_bnk_acct_num : check_bnk_acct_num,
  calculate_time_slot : calculate_time_slot,
  getTimeFromMins : getTimeFromMins,
  timeConvert1 : timeConvert1,
  upcomingCallsDate : upcomingCallsDate,
  SevenDayCallCount : SevenDayCallCount,
  reviewTotalCounts : reviewTotalCounts,
  pastSevenDayReviews : pastSevenDayReviews,
  check_favourite_experts : check_favourite_experts,
  check_user_slot_date : check_user_slot_date,
  user_media_count :  user_media_count,
  check_user_slot_date_string : check_user_slot_date_string,
  check_category_name : check_category_name,
  getTotalUsers : getTotalUsers,
  // totalEarnings : totalEarnings,
  check_monthly_earnings : check_monthly_earnings,
  check_monthly_earnings1 : check_monthly_earnings1,
  check_yearly_earnings1 : check_yearly_earnings1,
  time__Convert : time__Convert,
  getRatingUsers :getRatingUsers ,
  getTotalUsers1 : getTotalUsers1 ,
  totalExpertCalls : totalExpertCalls,
  user_info : user_info,
  create_payment_intent : create_payment_intent,
  confirm_payment_intent : confirm_payment_intent ,
  capture_funds : capture_funds,
  cancel_intent : cancel_intent,
  generate_twillio_access_token : generate_twillio_access_token ,
  check_next_seven_days_earnings : check_next_seven_days_earnings,
  check_next_month_earnings1 : check_next_month_earnings1,
  tranfer_ammount_to_bank_account : tranfer_ammount_to_bank_account,
  refund_intent : refund_intent,
  payout_intent : payout_intent,
  deducting_eighty_percent_money : deducting_eighty_percent_money,
  deducting_twenty_percent_money : deducting_twenty_percent_money,
  generate_otp : generate_otp,
  create_payment_intent_without_application_amount : create_payment_intent_without_application_amount,
  retrieve_stripe_vendor_id : retrieve_stripe_vendor_id,
  generate_random_string : generate_random_string,
  retrieve_payment_intent : retrieve_payment_intent,
  chcek_refferal_code_exists : chcek_refferal_code_exists,
  check_exist_status : check_exist_status,
  check_email_validation : check_email_validation,
  check_compny_and_address_exist : check_compny_and_address_exist,
  if_data_validates_or_not  :  if_data_validates_or_not,
  check_company_address_id : check_company_address_id,
  check_payload_data_exist : check_payload_data_exist,
  create_new_user : create_new_user,
  channel_details : channel_details,
  save_invited_members : save_invited_members,
  check_company_id : check_company_id,
  case2  : case2,
  save_data_invite :  save_data_invite,
  get_channel_data : get_channel_data,
  generate_qr_code : generate_qr_code,
  chck_if_user_exists : chck_if_user_exists,
  blocked_users_list : blocked_users_list  ,
  populate_task_members : populate_task_members,
  list_polls : list_polls,
  blocked_users_list_in_chat : blocked_users_list_in_chat,
  unread_message_count : unread_message_count,
  last_messages : last_messages,
  fetch_channel_members  : fetch_channel_members,
  update_read_status : update_read_status,
  check_compny_adeess_exist : check_compny_adeess_exist,
  save_invited_members_to_specific_members : save_invited_members_to_specific_members,
  fetch_unread_group_message : fetch_unread_group_message,
  member_already_exist : member_already_exist,
  fetch_names : fetch_names,
  fetch_meet_members : fetch_meet_members,
  check_if_member_already_added : check_if_member_already_added,
  if_company_and_address_are_same : if_company_and_address_are_same,
  get_voucher_data : get_voucher_data,
  wallet_ammount_of_user : wallet_ammount_of_user,
  total_emoji_count : total_emoji_count,
  uploadQrCode : uploadQrCode,
  is_alreay_reacted_on_message : is_alreay_reacted_on_message,
  alreay_reaction_on_message : alreay_reaction_on_message,
  add_saved_message_data_in_chat : add_saved_message_data_in_chat
};

