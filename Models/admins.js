const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admins = new Schema({
        accessToken: {type: String, default: null},
        password: {type: String, default: null},
        email: {type: String, default: null},
        createdAt:{type: Date, default: Date.now()}
},{timestamps : true})

module.exports = mongoose.model('admins', admins);
