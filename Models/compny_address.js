const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;


const compny_address_schema = new Schema({
  user_id : {
    type : Schema.ObjectId,
    ref : "users",
    sparse: true,
    default : null, 
  },
  company_id : {
    type : Schema.ObjectId,
    ref : "companies",
    sparse : true,
    default : null
  },
  address : {type : String,default  : null},
  is_deleted : {type : Boolean,default : false},
},{
  timestamps : true
});

const model_name = mongoose.model("compny_address",compny_address_schema) ;
module.exports = model_name ;



