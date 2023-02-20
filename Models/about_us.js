const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const about_us_schema = new Schema({
    about  : {type : String,default : null},
    is_deleted : {type : String,default : false}
},{
      timestamps : true 
});

const model_name = mongoose.model("about_us",about_us_schema) ;

module.exports = model_name ;