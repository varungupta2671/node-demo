const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;


const companies_schema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : "users",
        sparse : true,
        default : null
    },
    name : {type : String,default : null},
    is_deleted : {type :Boolean ,default : false},
},{
    timestamps : true
}) ;


const model_name = mongoose.model("companies",companies_schema) ;


module.exports = model_name ;