const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const plans_schema = new Schema({
    name : {type : String,default : null},
    type : {type : String,enum : ["monthly","daily","quarterly",null],default : null},
    price : {type : Number,default : 0},
    discounted_price : {type : Number,default : 0},
    currency : {type : String,default : null},
    is_deleted : {type : Boolean ,default : false}
},{
    timestamps : true 
}) ;


const model_name = mongoose.model("plans",plans_schema) ;

module.exports = model_name ;