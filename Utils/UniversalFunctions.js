/**
 * Created by Prince
 */



const Boom = require('boom'),
    Models = require('../Models'),
    Joi = require('joi'),
    Config = require('../Config'),
    ERROR = Config.responseMessages.ERROR,
    SUCCESS = Config.responseMessages.SUCCESS,
    bcrypt = require('bcryptjs')



function sendError(language,data,reply) {
     //console.log("....................",language)
     console.log("-----------------error------------------",data);
    let error;
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
        let finalMessage ;
        if(language == 1 || language == "ar" || language == "en") {finalMessage = data.customMessage.en}
        if(language == 2 || language == "ar" ) {finalMessage = data.customMessage.sp}
        else{
            finalMessage = data.customMessage.en
        }
        error =  Boom.create(data.statusCode, finalMessage);
        if(data.hasOwnProperty('type')) {
            error.output.payload.type = data.type;
            winston.error(error);
            return error;
        }
    }
    else {
        let errorToSend = '',
            type = '';

        if (typeof data == 'object') {
            if (data.name == 'MongoError') {

                if(language == 1  || language == "ar" || language == "en"){ errorToSend += ERROR.DB_ERROR.customMessage.en}
                else errorToSend += ERROR.DB_ERROR.customMessage.sp;


                type = ERROR.DB_ERROR.type;
                if (data.code = 11000) {

                    if(language == 1  || language == "ar" || language == "en"){ errorToSend += ERROR.DB_ERROR.customMessage.en}
                    else errorToSend += ERROR.DB_ERROR.customMessage.sp;

                    type = ERROR.DUPLICATE.type;
                }
            } else if (data.name == 'ApplicationError') {

                if(language == 1  || language == "ar" || language == "en"){ errorToSend += ERROR.DB_ERROR.customMessage.en}
                else errorToSend += ERROR.DB_ERROR.customMessage.sp;

                type = ERROR.APP_ERROR.type;
            } else if (data.name == 'ValidationError') {

                if(language == 1  || language == "ar" || language == "en"){ errorToSend += ERROR.DB_ERROR.customMessage.en}
                else errorToSend += ERROR.DB_ERROR.customMessage.sp;

                type = ERROR.APP_ERROR.type;
            } else if (data.name == 'CastError') {

                if(language && language == "ar") errorToSend += ERROR.DB_ERROR.customMessage.ar + ERROR.INVALID_OBJECT_ID.customMessage.ar;
                else errorToSend += ERROR.DB_ERROR.customMessage.en + ERROR.INVALID_OBJECT_ID.customMessage.en;

                type = ERROR.INVALID_OBJECT_ID.type;
            } else if(data.response) {
                errorToSend = data.response.message;
            }
        } else {
            errorToSend = data;
            type = ERROR.DEFAULT.type;
        }
        let customErrorMessage = errorToSend;
        if (typeof errorToSend == 'string'){
            if (errorToSend.indexOf("[") > -1) {
                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));
            } else {
                customErrorMessage = errorToSend;
            }
            customErrorMessage = customErrorMessage.replace(/"/g, '');
            customErrorMessage = customErrorMessage.replace('[', '');
            customErrorMessage = customErrorMessage.replace(']', '');
        }
        error =  Boom.create(400,customErrorMessage);
        error.output.payload.type = type;
        winston.error(error);
        return error;
    }
};

function sendSuccess(language,successMsg, data,reply) {
    successMsg = successMsg || SUCCESS.DEFAULT.customMessage.en;
    
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')){

        let finalMessage ;
        if(language == 1 || language == "ar" || language == "en"){finalMessage = successMsg.customMessage.en}
        else{
            finalMessage = successMsg.customMessage.en;
        }

        return {statusCode:successMsg.statusCode, message: finalMessage, data: data || {}};
    }
    else return {statusCode:200, message: successMsg, data: data || {}};
};

function failActionFunction(request, reply, error) {
    
    
    winston.info("==============request===================",request.payload,request.query, error)

    error.output.payload.type = "Joi Error";

    if (error.isBoom) {
        delete error.output.payload.validation;
        if (error.output.payload.message.indexOf("authorization") !== -1) {
            error.output.statusCode = ERROR.UNAUTHORIZED.statusCode;
            return reply(error);
        }
        let details = error.details[0];
        if (details.message.indexOf("pattern") > -1 && details.message.indexOf("required") > -1 && details.message.indexOf("fails") > -1) {
            error.output.payload.message = "Invalid " + details.path;
            return reply(error);
        }
    }
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage.replace(/\b./g, (a) => a.toUpperCase());
    delete error.output.payload.validation;
    return error;
};

var authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();

var authorizationHeaderObjOptional = Joi.object({
    authorization: Joi.string()
}).unknown();

let mediaAuthRequired =  Joi.object().keys({
    original: Joi.string().required(),
    thumbnail: Joi.string().required(),
    fileName: Joi.string().required(),
    type: Joi.string().required(),
    thumbnailMed: Joi.string().required(),
    _id:Joi.string().optional().allow('')
}).unknown().required();

let mediaAuth =  Joi.object().keys({
    original: Joi.string().optional().allow(''),
    thumbnail: Joi.string().optional().allow(''),
    fileName: Joi.string().optional().allow(''),
    type: Joi.string().optional().allow(''),
    thumbnailMed: Joi.string().optional().allow(''),
    _id:Joi.string().optional().allow('')
});


let mediaSchema = {
    original: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    thumbnailMed: { type: String, default: "" },
    fileName: { type: String, default: "" },
    type: { type: String, default: "" } // media format
};


var getFileNameWithUserId = function (thumbFlag, fullFileName, userId) {
    var prefix = Config.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.ORIGINAL;
    var ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    
    if (thumbFlag) {
        prefix = Config.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.THUMB;
    }

    return prefix + userId + ext;
};


module.exports = {
    failActionFunction : failActionFunction,
    authorizationHeaderObj:authorizationHeaderObj,
    authorizationHeaderObjOptional:authorizationHeaderObjOptional,
    sendSuccess : sendSuccess,
    sendError : sendError,
    mediaAuth: mediaAuth,
    mediaAuthRequired: mediaAuthRequired,
    mediaSchema: mediaSchema,
    getFileNameWithUserId:getFileNameWithUserId
};