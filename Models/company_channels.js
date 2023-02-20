const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const company_channels_schema = new Schema({
  user_id : {
    type : Schema.Types.ObjectId,
    ref : "users",
    sparse: true,
    default : null, 
  },
  company_id : {
    type : Schema.Types.ObjectId,
    ref : "companies",
    sparse : true,
    default : null
  },
  compny_address_id : [{
    type : Schema.Types.ObjectId,
    ref : "compny_address",
    sparse : true,
    default : null
  }], 
  channel_name : { type : String,default : null},
  image  : {type : String,default : null},
  description : {type : String,default : null},
  is_deleted : {type : Boolean,default : false} , 
  notification_allowed : {type : Boolean,default : true}  
},{
  timestamps : true
}); 
const model_name = mongoose.model("company_channels",company_channels_schema) ;
module.exports = model_name ;