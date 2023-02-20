const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;


const tasks_members_schema = new Schema({
  task_id : {
    type : Schema.Types.ObjectId,
    ref : "tasks",
    sparse : true,
    default : null
  },
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
  member_id : {
    type : Schema.Types.ObjectId,
    ref : "users",
    sparse : true,
    default : null,
  },
  task_completed : {type : Boolean ,default : false},
  task_completed_by_admin : {type : Boolean ,default : false},
  task_video : {type : String,default : null},
  is_deleted : {type : String,default : false},
},{
  timestamps : true 
});

const model_name = mongoose.model("tasks_members",tasks_members_schema) ;

module.exports = model_name ;