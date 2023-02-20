const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;
 
const wallet_schema = new Schema({
  user_id : {
    type : mongoose.Types.ObjectId,
    ref : "users",
    default : null
  },
  sender_id  :{
    type : mongoose.Types.ObjectId,
    ref : "users",
    default : null
  },
  status : { type : String,enum : ["credit","debit",null],default : null },
  ammount : { type : Number,default : 0 },
  date :{ type : Number,default : 0 },
  hashtag : { type : String ,default : null },
  is_deleted : { type : Boolean,default : false }
},{
  timestamps : true
});

const model_name = mongoose.model("wallets",wallet_schema) ;
module.exports = model_name ;