const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const notification_schema = new Schema({
  reciever_id :{ 
    type : Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
  sender_id : {
    type : Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
  task_id :{
    type : Schema.Types.ObjectId,
    ref : "tasks",
    default : null
  },
  member_id :  {
    type : Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
  meet_id :{ type : Schema.Types.ObjectId,ref : "meetings", default : null },
  chat_id :{ type : Schema.Types.ObjectId,ref : "chats", default : null },
  title : {type : String,default : null}, 
  type : {type : String,enum : ["CHATS","BIRTHDAY_WISH","Q&A","MEET_INVITE","POLL_INVITE","TASK_COMPLETE","COIN_REWARD","TASK_ASSIGN",null],default : null},
  date : {type : Number,default : 0},
  message : {type : String,default : null},
  highlight_message : {type : String,default : null},
  task_title : {type : String,default : null},
  task_description  :{ type : String,default : null},
  task_video : {type : String,default : null},
  is_read :  {type : Boolean,default : false},
  is_deleted : {type : Boolean,default : false},
},{
  timestamps : true,
});
const model  = mongoose.model("notifications",notification_schema) ;
module.exports = model;