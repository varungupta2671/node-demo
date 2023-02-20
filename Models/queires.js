const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const queires = new Schema({
  name: {type: String, default: null},
  email : {type : String,default : null },
  message : {type : String,default : null },
  is_deleted : {type : Boolean,default : false }
},{
  timestamps : true
}) ;


module.exports = mongoose.model("queires",queires) ;


