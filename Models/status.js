const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;


const status_schema = new Schema({
    name :  {type : String,default : null},
    is_deleted  : {type : Boolean ,default : false}
},{
    timestamps : true
});

const model_name = mongoose.model("status",status_schema) ;

module.exports = model_name ;