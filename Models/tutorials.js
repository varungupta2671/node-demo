const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const tutorials_schema = new Schema({
    image : {type : String,default : null},
    title : {type : String,default : null},
    description : {type : String,default : null},
    is_deleted : {type : Boolean ,default : false}
},{
    timestamps : true
});



const model_name = mongoose.model("tutorials",tutorials_schema) ;


module.exports = model_name ;
