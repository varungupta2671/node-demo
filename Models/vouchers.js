const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const voucher_schema = new Schema({
  name : {type : String,default : null},
  image :{type  : String,default : null},
  ammount : {type : Number,default : null},
  coupan :{type : String,default  : null},
  is_deleted : {type : Boolean ,default : false},
},{
  timestamps : true
});

const model_name  = mongoose.model("vouchers",voucher_schema) ;
module.exports =  model_name ;
