const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;


const polls_schema = new Schema({
      user_id : {
            type : Schema.Types.ObjectId,
            ref : "users",
            sparse : true,
            default : null
      },
      channel_id : {
            type : Schema.Types.ObjectId,
            ref : "company_channels",
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
      question : { type : String,default : null},
      status : {type : String , enum : ["upcoming","completed"] , default : "upcoming"},
      start_date : {type  : Number ,default : 0},
      start_date_in_string : {type : String,default : null},
      end_date  : {type : Number , default : 0 },
      responses : {type : Boolean , default : false},
      end_date_in_string : { type : String , default : null},
      is_deleted  : {type : Boolean , default : false},
},{
      timestamps : true,
});

const model_name = mongoose.model("polls",polls_schema) ;
module.exports = model_name ;