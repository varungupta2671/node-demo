const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ; 

const saved_items_schema = new Schema({
  user_id:{ type : Schema.Types.ObjectId,ref : "users", sparse : true, default : null  },
  message_id:{ type : Schema.Types.ObjectId,ref : "chats", sparse : true, default : null  },
  is_saved : {type : Boolean,default : false } ,
  is_deleted : {type : Boolean ,default : false} ,
  created_at : {type : Number ,default : +new Date()} ,
},{
  timestamps : true 
});

const model_name = mongoose.model("saved_items",saved_items_schema) ;

module.exports = model_name ;