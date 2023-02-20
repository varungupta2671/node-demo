const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

var privacy_policies_schema = new Schema({
    policy : {type : String ,default : null},
    is_deleted : {type : Boolean ,default : false}
},{
    timestamps : true ,
}) ;

var model_name = mongoose.model("privacy_policies",privacy_policies_schema) ;
module.exports = model_name ;