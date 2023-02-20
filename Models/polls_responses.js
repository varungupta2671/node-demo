const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const polls_responses_schema = new Schema({
      poll_id  : {
            type : Schema.Types.ObjectId,
            ref : "polls",
            sparse : true,
            default : null
      },
      answer_id : {
            type : Schema.Types.ObjectId,
            ref : "polls_answers",
            sparse : true,
            default : null
      },
      respond_by : {
            type : Schema.Types.ObjectId,
            ref :"users",
            sparse : true,
            default : null
      },
      answer_respond :{type : Boolean ,default : false},
      is_deleted : {type : Boolean ,default : false},
},{
      timestamps : true
});

const model_name = mongoose.model("polls_responses",polls_responses_schema) ;
module.exports = model_name ;