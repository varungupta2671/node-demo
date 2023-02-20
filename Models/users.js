const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const users = new Schema({
  accessToken: {type: String, default: null},
  full_name : {type : String,default : "Guest" },
  department_id : {
    type : Schema.Types.ObjectId,
    ref : "departments", 
    sparse : true,
    default :null
  }, 
  company_id  : {
    type : Schema.Types.ObjectId,
    ref : "companies",
    sparse : true,
    default :null
  },
  compny_address_id : {
    type : Schema.Types.ObjectId,
    ref : "compny_address",
    sparse : true,
    default :null
  },
  status :{ type : String,default: null},
  iso2_code : {type : String,default : null},
  country_code : {type : String,defautl : null},
  contact_number : {type : Number,default : 0},
  profile_picture : {type : String,default : null},
  email : {type : String,default : null},
  password : {type : String,default : null},
  socialKey : {type : String,default : null},
  company_name :  {type : String,default : null},
  is_user : {type : Boolean ,default : false},
  otp : {type : Number,default : 123456}, 
  otpVerified : {type : Boolean,default : false},
  dob: {type : String,default : null},
  date_and_month : {type : String,default : null},
  address_data: [{type : String,default : null}],
  isAvailable : {type : Boolean,default : false},
  wallet_ammount : {type : Number,default : 0 },
  // is_included : {type : Boolean,default : false},
  step1 : {type : Boolean ,default : false},
  step2 : {type : Boolean ,default : false},
  step3 : {type : Boolean ,default : false},
  isDeleted : {type : Boolean,default : false},
  isBlocked : {type : Boolean ,default : false}, 
  deviceToken: {type :  String,default :  null},
  deviceType: {type :  String, enum : ["WEB","ANDROID","IOS",null],default :  null},
},{
  timestamps : true
}) ;


module.exports = mongoose.model("users",users) ;


