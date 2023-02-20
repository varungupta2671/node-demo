const mongoose = require("mongoose") ;
const Schema = mongoose.Schema  ;

const chat_schema = new Schema({
  sender_id : {type : Schema.Types.ObjectId,ref : "users",default : null },
  reciever_id : {type : Schema.Types.ObjectId,ref : "users",default : null},
  channel_id : {type : Schema.Types.ObjectId,ref : "company_channels",default : null},
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
  conversation_id : {
    type : Schema.Types.ObjectId,
    ref : "chats",
    sparse : true,
    default : null,
  },
  reply_of_message : {type : String,enum : ["yes","no"],default :"no"},
  chat_format  :{type : String,enum : ["one-to-one","group"],defaut : "one-to-one"} ,
  message : {type :String,default : null},
  message_type : {type : String,enum :["image","video","text","document"],default : "text"},
  is_read : {type : Boolean,default : false},
  status_data : [{
        is_read : { type : Boolean, default : false},
        is_deleted : {type : Boolean ,default : false},
        user_id : {type : Schema.Types.ObjectId ,ref : "users",sparse : true,default : null}
  }],
  reaction :[{
        emoji : {type : String ,default : null},
        is_deleted : {type : Boolean ,default : false},
        total_count : {type : Number,default : 0},
        user_id : [{type : Schema.Types.ObjectId ,ref : "users",sparse : true,default : null}],
  }],
  reply :[{
          time: {type : Number ,default : 0},
          is_deleted : {type : Boolean ,default : false},
          user_id : {type : Schema.Types.ObjectId ,ref : "users",sparse : true,default : null},
          message : {type :String,default : null},
          index : {type : Number,default : null},
  }],
  total_reply_count :{type : Number,default : 0},
  date  :{type : Number,default : 0},
  time: {type : Number ,default : 0},
  is_deleted : {type : Boolean,default : false},
},{
  timestamps : true
});
const model = mongoose.model("chats",chat_schema) ;
module.exports = model; 