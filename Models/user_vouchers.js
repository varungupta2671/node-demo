const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const user_voucher_schema = new Schema({
  voucher_id : {
    type : Schema.Types.ObjectId,
    ref : "vouchers",
    default : null
  },
  user_id :{
    type : Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
},{
  timestamps : true 
});

const model_name = mongoose.model("user_vouchers",user_voucher_schema) ;
module.exports =  model_name ;
