const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const meeting_members_schema = new Schema({
  meeting_id  : {
    type : Schema.Types.ObjectId,
    ref : "meetings",
    sparse : true,
    default : null
  },
  company_id : {
    type : Schema.Types.ObjectId,
    ref  : "companies",
    sparse : true,
    default : null
  },
  compny_address_id : {
    type : Schema.Types.ObjectId,
    ref : "compny_address",
    sparse : true,
    default : null
  },
  member_id : {
    type : Schema.Types.ObjectId,
    ref : "users",
    sparse : true,
    default : null
  },
  is_deleted : {type : Boolean ,default : false},    
},{
  timestamps : true 
});

const model_name = mongoose.model("meeting_members",meeting_members_schema) ;
module.exports = model_name ;