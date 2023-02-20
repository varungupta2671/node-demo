const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const polls_members_schema = new Schema({
  poll_id  : {
        type : Schema.Types.ObjectId,
        ref : "polls",
        sparse : true,
        default : null
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
  member_id : {
        type : Schema.Types.ObjectId,
        ref : "users",
        sparse : true,
        default : null,
  },
  is_deleted  :{type : Boolean,default : false}
},{
  timestamps : true,
});
const model_name = mongoose.model("polls_members",polls_members_schema) ;

module.exports  = model_name ;
