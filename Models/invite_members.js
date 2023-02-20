const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const invite_members_schema = new Schema({
      user_id : {
            type : Schema.ObjectId,
            ref : "users" ,
            sparse : true ,
            default : null
      },
      company_id : {
            type : Schema.ObjectId,
            ref : "companies",
            sparse : true ,
            default : null
      },
      compny_address_id : {
            type : Schema.ObjectId,
            ref : "compny_address",
            sparse : true ,
            default : null
      },
      member_id : {
            type : Schema.ObjectId,
            ref : "users" ,
            sparse : true ,
            default : null
      },
      email : {type :String,default : null},
      is_deleted : {type  : Boolean,default  : false}
      
},{
      timestamps : true
}) ;


const model_name = mongoose.model("invite_members",invite_members_schema) ;

module.exports = model_name ;