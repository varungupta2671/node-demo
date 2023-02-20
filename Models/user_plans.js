const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const user_plans_schema = new Schema({
      user_id : {
            type : Schema.ObjectId,
            ref : "plans",
            sparse : true,
            default : null
      },
      plan_id : {
            type : Schema.ObjectId,
            ref : "plans",
            sparse : true,
            default : null
      },
      transaction_id : {type : String,default  : null},
      status : {type : String,enum : ["bought","cancelled",null],default : null},
      purchase_date : {type : String,default : null},
      valid_till : {type : Number ,default : 0},
      is_deleted : {type : Boolean ,default : false},
},{
      timestamps : true 
}) ;

const model_name = mongoose.model("user_plans",user_plans_schema) ;

module.exports = model_name ;