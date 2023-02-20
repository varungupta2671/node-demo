const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const tasks_schema = new Schema({
      user_id : {
            type : Schema.Types.ObjectId,
            ref : "users",
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
      channel_id : {
            type : Schema.Types.ObjectId,
            ref : "company_channels",
            sparse : true,
            default : null
      },
      title : {type : String,default : null},
      description  :{ type : String,default : null},
      start_date : {type : Number,default : 0},
      start_date_in_string : {type : String,default : null},
      end_date : { type : Number,default : 0},
      end_date_in_string: { type : String,default : null},
      recurring : { type : String,enum : ["Weekly","Monthly","Yearly","notRequired"],default : "notRequired" },
      status : {type : String,enum : ["Pending","Complete","Overdue"],default : "Pending"},
      coins : { type : Number ,default : 0 },
      member  : [{type : String,default : null}],
      is_deleted : {type : Boolean ,default  : false},
},{
      timestamps : true
}) ;


const model_name = mongoose.model("tasks",tasks_schema) ;

module.exports = model_name ;