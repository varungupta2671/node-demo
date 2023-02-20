const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const polls_answers_schema = new Schema({
	poll_id : {
		type : Schema.Types.ObjectId,
		ref : "polls",
		sparse : true,
		default : null
	},
	company_id : {
            type : Schema.Types.ObjectId,
            ref  : "companies",
            sparse : true,
            default : null
      },
      compny_address_id : {
            type : Schema.Types.ObjectId,
            ref : "compny_address",
            sparse : true,
            default : null
      },
      respond_count : {type : Number ,default : 0},
	answer : {type : String,default : null},
	is_deleted : {type : Boolean ,default : false}
},{
	timestamps : true
});

const model_name = mongoose.model("polls_answers",polls_answers_schema) ;
module.exports = model_name ;