
'use strict';

let mongoose = require('mongoose'),
    Config = require('../Config'),
    DAO = require('../DAOManager').queries,
    Models = require('../Models'),
    bcrypt = require('bcryptjs');

    mongoose.Promise = Promise;
console.log("====process.env.NODE_ENV======",process.env.NODE_ENV)

//Connect to MongoDB
let options = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useFindAndModify: false,
            useCreateIndex: true
}

mongoose.connect(Config[process.env.NODE_ENV].mongoDb.URI,options).then(success => {
    winston.info('MongoDB Connected');
}).catch(err => {
    console.log("====================",err)
    winston.info({ERROR: err});
    process.exit(1);
});


// connect to firebase
