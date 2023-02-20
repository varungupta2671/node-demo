
const Jwt = require('jsonwebtoken'),
    Config = require('../Config'),
    DAO = require('../DAOManager').queries,
    Models = require('../Models/'),
    UniversalFunctions = require('../Utils/UniversalFunctions'),
    _ = require('lodash')
    ERROR = Config.responseMessages.ERROR;

var generateToken = function(tokenData,userType) {
    return new Promise((resolve, reject) => {
        try {
           let secretKey;
            switch(userType){
                case Config.APP_CONSTANTS.SCOPE.ADMIN:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_ADMIN;
                    break;
                case Config.APP_CONSTANTS.SCOPE.USER:
                    secretKey = Config.APP_CONSTANTS.SERVER.JWT_SECRET_KEY_USER;
                    break;  
            }
            

         //   console.log("........tokenData...........",tokenData);
            let token = Jwt.sign(tokenData, secretKey);
         //    console.log("=======secretKey==========",token,secretKey)

            return resolve(token);
        } catch (err) {
            return reject(err);
        }
    });
};


var verifyToken = async function verifyToken(tokenData,secretKey) {


            // console.log("============secretKey.headers.authorization================",secretKey.headers.authorization);
            var user;
            var token = secretKey.headers.authorization.substr(7,300);

            // console.log("...... decoded .........",tokenData)

            let query = {
                _id : tokenData._id,
                accessToken : token
            }
            

         if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.ADMIN){
           // console.log("..+++++++++++++++++++.user..******************............",query);
             
            user = await DAO.getData(Models.admins,query,{__v : 0},{lean : true});
         //   console.log("..+++++++++++++++++++.user..******************............",user);
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
         }
         
        else if(tokenData.scope === Config.APP_CONSTANTS.SCOPE.USER){
            user = await DAO.getData(Models.users,query,{__v : 0},{lean : true});
            // console.log("Checking user data in token manager ---->>>",user) ;
            if(!(user.length)){
                throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
            }
            
        }

        if(user.length === 0){
            throw UniversalFunctions.sendError('en', ERROR.UNAUTHORIZED);
        } else{
            user[0].scope = tokenData.scope;
            return {
                isValid: true,
                credentials : user[0]
            }
        }
       
};

module.exports={
    generateToken:generateToken,
    verifyToken:verifyToken,
};