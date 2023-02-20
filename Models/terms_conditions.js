const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const terms_conditions_schema = new Schema({
    terms : {type : String,default : null},
    is_deleted : {type : Boolean ,default : false}
},{
    timestamps : true 
});

const model_name = mongoose.model("terms_conditions",terms_conditions_schema) ;

module.exports = model_name ;