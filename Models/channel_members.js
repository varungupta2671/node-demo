const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const channel_members_schema = new Schema({
  company_channels_id : {               
    type : Schema.ObjectId,
    ref : "company_channels",
    sparse : true,
    default : null
  },
  member_id : {
    type : Schema.ObjectId,
    ref : "users",
    sparse : true,
    default : null
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
  is_admin : {type : Boolean,default : false},
  is_deleted : {type : Boolean ,default : false},
},{
  timestamps : true
}) ;

const model_name = mongoose.model("channel_members",channel_members_schema) ;
module.exports = model_name ;