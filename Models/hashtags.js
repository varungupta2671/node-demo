const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const hastag_schema = new Schema({
  name : {type : String,default  : null},
  is_deleted :{type : Boolean,default : false}
},{
  timestamps : true
}) ;

const modle_name = mongoose.model("hashtags",hastag_schema) ;
module.exports = modle_name ;