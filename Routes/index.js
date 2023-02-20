
var admin = require('./adminRoutes');
var users = require('./userRoutes');
var all = [].concat(
    admin, 
    users
    );
module.exports = all;

