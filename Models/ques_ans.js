const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const ques_ans_schema = new Schema({
    user_id : {
      type : Schema.Types.ObjectId,
      ref : "users",
      default : null
    },
    question : {type : String,default : null},
    is_deleted : {type : Boolean,default : false},
    date : {type : Number,default : 0}
},{
    timestamps : true
});

const model = mongoose.model("ques_ans",ques_ans_schema) ;

module.exports = model ;