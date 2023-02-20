const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const quesAnsMemberSchema = new Schema ({
  ques_ans_id  :{
    type : Schema.Types.ObjectId,
    ref : "ques_ans",
    default : null
  },
  member_id :{
    type : Schema.Types.ObjectId,
    ref : "users",
    default : null
  },
  respond : {type : String,default : null},
  is_responded : {type : Boolean,default  : false},
  date : {type : Number,default : 0},
  is_deleted : {type : Boolean,default  : false},
},{
  timestamps : true 
});
const model = mongoose.model("ques_ans_members",quesAnsMemberSchema);
module.exports = model ;