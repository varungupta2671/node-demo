const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const blocked_users_schema = new Schema({
      user_id : {
            type : Schema.Types.ObjectId,
            ref : "users",
            sparse : true,
            default : null
      },
      blocked_id : {
            type : Schema.Types.ObjectId,
            ref : "users",
            sparse : true,
            default : null
      },
      is_blocked : {type : Boolean , default : false},
      is_deleted : {type : Boolean , default : false},
},{
      timestamps : true 
});

const model_name = mongoose.model("blocked_users",blocked_users_schema) ;
module.exports = model_name ;