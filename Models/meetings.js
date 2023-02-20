const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const meetings_schema = new Schema({
      user_id  :{
            type : Schema.Types.ObjectId,
            ref : "users",
            sparse : true,
            default : null
      },
      channel_id :{ 
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
      title : {type : String,default : null},
      description : {type : String,default : null},
      start_date : {type : Number ,default : 0},
      start_date_in_string : {type : String,default : null},
      end_date : {type : Number,default : 0},
      end_date_in_string : {type : String,default : null},
      start_time : {type : Number,default : 0},
      end_time : {type : Number ,default : 0},
      time_zone : {type : String,default  : "Asia/Kolkata"},
      status : {type : String ,enum : ["upcoming","completed"],default : "upcoming"},
      call_link : {type : String,default : null},
      is_deleted : {type : Boolean ,default : false}
},{
      timestamps : true ,
});
                                 
const model_name = mongoose.model("meetings",meetings_schema) ;
module.exports = model_name ;