var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
const userController = require("../Controller/userController");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
  {
  method: 'POST',
  path: '/User/imageUpload',
  options: {
    description: 'User image upload  Api',
    auth:false,
    tags: ['api'],
    handler: (request, reply) => {
    return Controller.userController.imageUpload(request.payload)
      .then(response => {
      return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT, response, reply);
      })
      .catch(error => {
      winston.error("=====error=============", error);
      return UniversalFunctions.sendError("en",error, reply);
      });
    },
    validate: {
      payload: {
        image  : Joi.any().meta({ swaggerType : 'file' }).optional().description('Image File'),
        audio  : Joi.any().meta({ swaggerType : 'file' }).optional().description('Audio File'),
        video  : Joi.any().meta({ swaggerType : 'file' }).optional().description('Video File'),  
        pdf :  Joi.any().meta({ swaggerType : 'file' }).optional().description('PDF File')
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
        responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
  },
  {
        method: "POST",
        path: "/User/signUp",
        options: {
              description: "signup Api",
              auth: false,
              tags: ["api"],
              handler: (request, reply) => {
              return Controller.userController.sign_up(request.payload)
              .then(response => {
              return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
              })
              .catch(error => {
              winston.error("=====error=============", error);
              return UniversalFunctions.sendError("en", error, reply);
              });
              },
              validate: {
              payload: {
                    full_name : Joi.string().required() ,
                    email : Joi.string().required().email(),
                    department_id : Joi.string().required().description("add depts _id here"),
                    iso2_code : Joi.string().required(),
                    country_code : Joi.string().required(),
                    password : Joi.string().required(),
                    confirm_password : Joi.string().required(),
                    contact_number : Joi.number().required(),
                    deviceType : Joi.string().optional().valid("WEB","ANDROID","IOS"),
                    deviceToken : Joi.string().optional(),
              },
              failAction: UniversalFunctions.failActionFunction
              },
              plugins: {
                    "hapi-swagger": {
                          payloadType: "form",
                          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
        method: "POST",
        path: "/User/otpVerified",
        options: {
              description: "otp Verified",
              auth: { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
              tags: ["api"],
              handler: (request, reply) => {
              return Controller.userController.otpVerified(request.payload,request.auth.credentials)
              .then(response => {
              return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
              })
              .catch(error => {
              winston.error("=====error=============", error);
              return UniversalFunctions.sendError("en", error, reply);
              });
              },
              validate: {
              payload: {
              otp : Joi.number().integer().required() ,

              },
              headers: UniversalFunctions.authorizationHeaderObj,
              failAction: UniversalFunctions.failActionFunction
              },
              plugins: {
              "hapi-swagger": {
              payloadType: "form",
              responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
              }
              }
        }
  },
  {
        method: "GET",
        path: "/User/otpResend",
        options: {
        description: "otp Resend",
        auth: { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
        tags: ["api"],
        handler: (request, reply) => {
              return Controller.userController.otpResend(request.query,request.auth.credentials)
              .then(response => {
              return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
              })
              .catch(error => {
              return UniversalFunctions.sendError("en", error, reply);
              });
        },
        validate: {
              query: {},
              headers: UniversalFunctions.authorizationHeaderObj,
              failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
              "hapi-swagger": {
              payloadType: "form",
              responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
              }
        }
        }
  },
  {
        method: "POST",
        path: "/User/login",
        options: {
        description: "login Apis",
        auth: false,
        tags: ["api"],
        handler: (request, reply) => {
              return Controller.userController.login(request.payload)
              .then(response => {
              return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
              })
              .catch(error => {
              return UniversalFunctions.sendError("en", error, reply);
              });
        },
        validate : {
              payload : {
                    email:Joi.string().required().email(),
                    password : Joi.string().required(),
                    is_user : Joi.boolean().optional(),
                    deviceType : Joi.string().optional().valid("WEB","ANDROID","IOS"),
                    deviceToken : Joi.string().optional(),
              },
              failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
              "hapi-swagger": {
              payloadType: "form",
              responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
              }
        }
        }
  },
  {
        method : "POST",
        path : "/User/logout" ,
        options : {
        description : "logout  of an account API",
        auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
        tags : ["api"],
        handler : (request,reply ) => {
              return Controller.userController.logout(request.auth.credentials) 
              .then(response => {
              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply )
              })
              .catch(error => {
              return UniversalFunctions.sendError("enn",error,reply)
              }) ;
        },
        validate : {
              headers : UniversalFunctions.authorizationHeaderObj,
              failAction : UniversalFunctions.failActionFunction
        },
        plugins : {
              "hapi-swagger" : {
              payloadType : "form",
              responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
              }
        }
        }
  },
  {
        method : "GET",
        path : "/User/listDepts",
        options : {
              description : "listing of all depts API",
              tags : ["api"],
              auth : false,
              handler : (request,reply) => {
                    return Controller.userController.list_departments()
                    .then(response => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    query : {},
                    failAction : UniversalFunctions.failActionFunction,
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
        method: 'POST',
        path: '/User/socialLogin',
        options: {
              description: 'social Login of user Api',
              auth: false,
              tags: ['api'],
              handler: (request, reply) => {
                    return Controller.userController.social_login(request.payload)
                    .then(response => {
                          return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
                    })
                    .catch(error => {
                          return UniversalFunctions.sendError("en", error, reply);
                    });
              },
              validate: {
                    payload: {
                          contact_number : Joi.number().optional(),
                          department_id  : Joi.string().optional(),
                          socialKey : Joi.string().required().description("Enter social key here"),
                          profile_picture : Joi.string().optional(),
                          full_name : Joi.string().optional(),
                          email : Joi.string().optional().email(),
                          deviceType: Joi.string().optional().valid('WEB','ANDROID', 'IOS'),
                          deviceId: Joi.string().optional(),
                    },
                    failAction: UniversalFunctions.failActionFunction
              },
              plugins: {
                    'hapi-swagger': {
                          payloadType: 'form',
                          responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  // updatePassword
  {
        method : "PUT",
        path : "/User/updatePassword",
        options : {
              description : "Ipdate User Password",
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              tags : ["api"],
              handler : (request,reply) => {
              return Controller.userController.updatePassword(request.payload,request.auth.credentials)
              .then(response => {
                    return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply)
              }).catch(error => {
                    return UniversalFunctions.sendError("enn",error,reply)
              });
              },
              validate : {
              payload : {
                    currentPassword  : Joi.string().required(),
                    newPassword : Joi.string().required(),
                    confirmPassword : Joi.string().required()
              },
              headers : UniversalFunctions.authorizationHeaderObj,
              failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
              "hapi-swagger" : {
                    payloadType : "form",
                    responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
              }
              }
        }
  },  
  // forgot passowrd
  {
        method : "POST",
        path : "/User/forgotPassword" ,
        options : {
              description : "User forgot Password",
              auth : false,
              tags : ["api"] ,
              handler : (request,reply) =>{
              return Controller.userController.forgotPassword(request.payload)
              .then(response => {
                    return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
              }).catch(error => {
                    return UniversalFunctions.sendError("enn",error,reply) ;
              });
              },
              validate : {
              payload : {
                    email : Joi.string().required().email()
              },
              // headers : UniversalFunctions.authorizationHeaderObj,
              failAction : UniversalFunctions.failActionFunction
              },
              plugins :{
              "hapi-swagger " : {
                    payloadType : "form",
                    responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
              }
              }
        }
  },
  {
        method : "GET",
        path : "/User/accessTokenLogin",
        options : {
              description : "access token login API",
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              tags : ["api"],
              handler : (request,reply) => {
              return Controller.userController.accessTokenLogin(request.query,request.auth.credentials)
              .then(response => {
                    return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
              }).catch(error => {
                    return UniversalFunctions.sendError("enn",error,reply) ;
              }) ;
              },
              validate : { 
              query : {},
              headers : UniversalFunctions.authorizationHeaderObj,
              failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
    method : "POST",
    path : "/User/addCompanies",
    options : {
      description : "add compny name & its addressess API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.add_companies(request.payload,request.auth.credentials)
        .then (response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply); 
        });
      },
      validate : {
        payload : {
            addresses : Joi.array().items(Joi.object().keys({
                  name : Joi.string().required().description("Name of company"),
                  address : Joi.array().required().description("['','']")
            }))
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
            "hapi-swagger" : {
                  payloadType : "form",
                  responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
      }
    }
  },
  {
        method : "GET",
        path : "/User/listCompany" ,
        options : {
              description : "listing of companies of user API",
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              tags : ["api"],
              handler : (request,reply ) => {
                    return Controller.userController.list_companies(request.query,request.auth.credentials) 
                    .then(response => {
                    return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply )
                    })
                    .catch(error => {
                    return UniversalFunctions.sendError("enn",error,reply)
                    }) ;
              },
              validate : {
                    query  :{},
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
        method : "GET",
        path : "/User/listCompanyAddress" ,
        options : {
              description : "listing of company addresss of user API",
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              tags : ["api"],
              handler : (request,reply ) => {
                    return Controller.userController.list_company_address(request.query,request.auth.credentials) 
                    .then(response => {
                    return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply )
                    })
                    .catch(error => {
                    return UniversalFunctions.sendError("enn",error,reply)
                    }) ;
              },
              validate : {
                    query  :{
                          company_id : Joi.string().required().description("Enter the _id of the Company ")
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
        method : "POST",
        path : "/User/addChannels",
        options : {
              description : "add channels for compnies. API",
              tags : ["api"],
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler :(request,reply) => {
                    return Controller.userController.add_channels(request.payload,request.auth.credentials)
                    .then(response => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    payload : {
                          all_data : Joi.array().items(Joi.object().keys({
                                company_id : Joi.string().required().description("add the _id of specific company"),
                                location_type  : Joi.string().required().valid("One","Multiple","All"),
                                location : Joi.array().optional().description("['','']"),
                                // location_for_one_address  : Joi.string().optional().description("use this key if location of only one comapnanies"),
                                channel_name :  Joi.string().required()

                          }))
                          
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType  : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
    method : "POST",
    path : "/User/inviteMembers",
    options : {
      description : "Inviting Compny members via email API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply)=> {
        return Controller.userController.invite_company_members(request.payload,request.auth.credentials)
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : { 
          members : Joi.array().items(Joi.object().keys({
            company_id : Joi.string().required().description("add the _id of the specific company"),
            compny_address_id : Joi.string().required().description("add the addrsss of the specific copmany"),
            email : Joi.array().required().description("emails of the members to be invited"),
            channel_id : Joi.string().optional().description("add channel id of specific location to add member in the channel")
          })),
        },
        headers  : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
        method : "GET",
        path : "/User/listPlan",
        options : {
              description : "listing of all plans user side API",
              tags : ["api"],
              auth  : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler : (request,reply) => {
                    return Controller.userController.list_plans(request.query,request.auth.credentials)
                    .then(response => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    query : {},
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType :"form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                    }
              }
        }
  },
  {
        method : "POST",
        path : "/User/buyPans",
        options : {
              description : "buy plans API",
              tags : ["api"],
              auth  : {strategies  : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler  : (request,reply) => {
                    return Controller.userController.add_user_plan(request.payload,request.auth.credentials)
                    .then(response => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error =>{
                          return UniversalFunctions.sendError("enn",error,repply) ;
                    });
              },
              validate : {
                    payload : {
                          plan_id : Joi.string().required().description("plz add planId here"),
                          status : Joi.string().required().valid("bought","cancelled"),
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction  : UniversalFunctions.failActionFunction,
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
        method : "GET",
        path : "/User/userPlans",
        options : {
              description : "listing of plans bought by user API",
              tags : ["api"],
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler : (request,reply) => {
                    return Controller.userController.list_user_plans(request.query,request.auth.credentials) 
                    .then(response => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    query : {},
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction,
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : UniversalFunctions.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
    method : "GET",
    path : "/User/list/companyMembers",
    options : {
      description : "API listing of company members based on location",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.list_company_members(request.query,request.auth.credentials) 
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query :{
          company_id : Joi.string().required().description("Enter company address _id here"),
          compny_address_id : Joi.string().optional().description("enter the location id of the company"),
          channel_id : Joi.string().optional() ,
          task_id : Joi.string().optional() ,
          poll_id : Joi.string().optional() ,
          meeting_id : Joi.string().optional() ,
          type : Joi.string().optional().valid("include","exclude"),
          skipPage : Joi.number().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
        method : "POST",
        path  : "/User/createChannels",
        options : {
              description : "Create channels & add members API",
              tags  :["api"],
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler  :(request,reply) => {
                    return Controller.userController.add_edit_channels_with_members(request.payload,request.auth.credentials) 
                    .then(response =>{
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    payload : {
                          image : Joi.string().optional(),
                          _id : Joi.string().optional(),
                          company_id : Joi.string().required().description("add compnaY _id here"),
                          compny_address_id : Joi.string().required(),
                          channel_name : Joi.string().required(),
                          description : Joi.string().required(),
                          channel_member : Joi.array().items(Joi.object().keys({
                                member : Joi.string().required() 
                          })),
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction,     
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
        method : "GET",
        path : "/User/list/Channels",
        options : {
              description : "listing of all channels eithr user or admin API",
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              tags : ["api"],
              handler : (request,reply) =>{
                    return Controller.userController.list_channels_with_count(request.query,request.auth.credentials)
                    .then(response => {
                          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,response,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("en",error,reply) ;
                    }) ;
              },
              validate : {
                    query : {
                      company_id : Joi.string().required("enter _id of company"),
                      compny_address_id : Joi.string().optional('enter compny adresss _id here') ,
                      type : Joi.string().required().valid("admin","user") ,
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
        method :  "GET",
        path : "/User/list/adminChannels",
        options : {
              description : "listing of channels of the admin company",
              tags : ["api"],
              auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler : (request,reply) =>{
                    return Controller.userController.vendor_list_channels(request.query,request.auth.credentials)
                    .then(respond => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
                    }).catch(error => {
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    query : {
                      company_id : Joi.string().required().description("enter the _id of the comapny"),
                      selectType : Joi.string().optional().valid("All"),
                      compny_address_id : Joi.string().optional().description("enter the _id of compny addrsss")
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" :{
                          payloadType : "form",
                          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                    }
              }
        }
  },
  {
    method : "POST",
    path : "/User/AddTasks",
    options : {
      description : "create new tasks or edit tasks API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.add_edit_tasks(request.payload,request.auth.credentials)
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          status  : Joi.string().optional().valid("Pending","Complete","Overdue"),
          _id : Joi.string().optional().description("enter Task _id to edit"),
          channel_id : Joi.string().optional().description('add channel _id here'),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.optional(),
          title : Joi.string().optional(),
          description : Joi.string().optional(),
          start_date : Joi.string().optional().description("plz use YYYY/MM/DD format"),
          end_date : Joi.string().optional().description("plz use YYYY/MM/DD format"),
          recurring : Joi.string().optional().valid("Weekly","Monthly","Yearly","notRequired") ,
          coins : Joi.number().optional(),
          members : Joi.array().items(Joi.object().keys({
            member_id : Joi.string().optional().description("add _id of the participent")
          }))
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/complete/task",
    options : {
      description : "mark as complete task API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.task_complete_by_user(request.payload,request.auth.credentials)
        .then((respond) => {
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error) => {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : {
          task_id : Joi.string().required().description("enter task _id here"),
          company_id : Joi.string().optional().description("enter compny _id here"),
          compny_address_id : Joi.string().optional().description("compny address _id here"),
          task_completed : Joi.boolean().optional(),
          task_video : Joi.string().optional().description("upload completed task video here")
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/taskById",
    options :{
      description : "listing of task by _id API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.list_task_by_id(request.query,request.auth.credentials)
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {
          _id : Joi.string().required().description("enter task _id here"),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form" ,
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/assignedTasks",
    options  :{
      description : "listing of all the tasks",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.list_assigned_task(request.query,request.auth.credentials)
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {
          company_id : Joi.string().required(),
          compny_address_id : Joi.string().required(),
          status : Joi.string().required().valid("Pending","Complete","Overdue"),
          _id : Joi.string().optional().description("enter task _id here"),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form" ,
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/tasks",
    options : {
      description : "complete details of task based on _id API",
      tags : ["api"],
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.USER ] },
      handler :(request,reply) => {
        return Controller.userController.fetch_task_details(request.query,request.auth.credentials)
        .then(response => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {
          _id : Joi.string().required().description("plz enter task Id here")
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }  
  },
  {
    method : "POST",
    path : "/User/addPolls",
    options : {
      description : "add or edit polls API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.add_edit_polls(request.payload,request.auth.credentials)
        .then(respond => {
          return  UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          _id : Joi.string().optional().description("enter poll _id here to edit"),
          channel_id : Joi.string().optional(),
          question : Joi.string().optional(),
          compny_address_id : Joi.string().optional(),
          company_id : Joi.string().optional(),
          answer_name:  Joi.array().items(Joi.object().keys({
            _id : Joi.string().optional().description("enter answer _id here"),
            answer : Joi.string().optional() 
          })),
          start_date : Joi.string().optional().description("enter date in YYYY/MM/DD format"),
          end_date :  Joi.string().optional().description("enter date in YYYY/MM/DD format"),
          members : Joi.array().items(Joi.object().keys({
            member_id : Joi.string().required().description("Plz add the members _id here")
          }))
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/respondPolls",
    options : {
      description : "respond to polls API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.add_respond_to_polls(request.payload,request.auth.credentials)
        .then(respond => {
          return  UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          poll_id : Joi.string().required().description("enter poll _id"),
          answer_id : Joi.string().required().description("enter answer _id"),
          respond_by : Joi.string().required().description("enter user _id here"),
          answer_respond : Joi.boolean().required(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/status",
    options : {
      description : "listing of all the statuses API",
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.USER ] },
      tags : ["api"],
      handler : (request,reply)=>{
        return Controller.userController.list_status(request.query,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {},
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType :  "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/editProfile",
    options : {
      description : "editing user profile API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.edit_profile(request.payload,request.auth.credentials)
        .then(respond =>{
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply);
        });
      },
      validate : {
        payload : {
          profile_picture : Joi.string().optional(),
          full_name : Joi.string().optional(),
          department_id  : Joi.string().optional(),
          dob : Joi.string().optional(),
          status : Joi.string().optional(),
          email : Joi.string().optional(),
          contact_number : Joi.number().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/deleteChannels",
    options : {
      description : "deleting channels API",
      tags : ["api"],
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.USER ] },
      handler :(request,reply) => {
        return Controller.userController.delete_user_channels(request.payload,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          _id : Joi.string().required().description("enter channel _id here"),
          is_deleted : Joi.boolean().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger"  : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/getTerms",
    options : {
      description : "listing of terms & conditions API",
      tags : ["api"],
      auth : false,
      handler :(request,reply) => {
        return Controller.userController.list_terms().
        then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/listPolicy",
    options : {
      description : "listing of Privacy Policy API",
      tags : ["api"],
      auth : false,
      handler :(request,reply) => {
        return Controller.userController.list_policies()
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate :{
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" :{
          payloadType : "form",
          respondMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/listAboutUs",
    options : {
      description : "listing of About Us API",
      tags : ["api"],
      auth : false,
      handler :(request,reply)=>{
        return Controller.userController.list_about_us()
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(eror => {
          return UniversalFunctions.sendError("enn",error,reply);
        });
      },
      validate : {
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/createQrCode",
    options : {
      description : "create qr code API" ,
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler: (request,reply) => {
        return Controller.userController.create_qr_code(request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/blockUsers",
    options : {
      description : "block users API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply)=> {
        return Controller.userController.block_users(request.payload,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          blocked_id : Joi.string().required().description("enter the user tpo blcok"),
          is_blocked : Joi.boolean().required()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction 
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/userBlocked",
    options : {
      description : "listing of the user blocked",
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.USER ] },
      tags : ["api"],
      handler : (request,reply)=> {
        return Controller.userController.list_blocked_users(request.query,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply); 
        });
      },
      validate : {
        query : {
          pageNumber : Joi.number().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responsMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/listPolls",
    options : {
      description : "listing of all the polls API",
      tags : ["api"],
      auth : {strategies : [ Config.APP_CONSTANTS.SCOPE.USER ]},
      handler : (request,reply) => {
        return Controller.userController.list_polls(request.query,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {
          _id : Joi.string().optional(),
          status : Joi.string().required().valid("upcoming","completed"),
          company_id : Joi.string().required(),
          compny_address_id : Joi.string().required()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/changeAvailability",
    options : {
      description : "changing availability of an user API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler :(request,reply) => {
        return Controller.userController.change_availability(request.payload,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          isAvailable : Joi.boolean().required()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" :{
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/deletePolls",
    options : {
      description : "deleting polls API",
      tags  : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler :(request,reply) => {
        return Controller.userController.delete_polls(request.payload,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          _id : Joi.string().required().description("enter poll Id here"),
          is_deleted : Joi.boolean().required(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }   
  },
  {
    method : "PUT",
    path : "/User/deleteTasks",
    options : {
      description : "deleting tasks API",
      tags  : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler :(request,reply) => {
        return Controller.userController.delete_task(request.payload,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        payload : {
          _id : Joi.string().required().description("enter poll Id here"),
          is_deleted : Joi.boolean().required(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }   
  },
  {
    method :"GET",
    path : "/User/list/respondAnswers",
    options : {
      description : "listing of all the users responding to an answer API",
      tags : ["api"],
      auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]} ,
      handler : (request,reply) => {
        return Controller.userController.list_answers_respond(request.query,request.auth.credentials)
        .then(respnd => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respnd,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate  : {
        query : {
          answer_id : Joi.string().required("enter asnwer _id here"),
          poll_id : Joi.string().required("emter poll _id here"),
          pageNumber : Joi.number().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/createMeeting",
    options : {
      description : "API create or edit meetings",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.add_edit_meeting(request.payload,request.auth.credentials)
        .then(respond =>{
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error =>{
          return UniversalFunctions.sendError("enn",error,reply);
        });
      },
      validate : { 
        payload : {
          _id : Joi.string().optional().description("edit specific meeting by _id"),
          channel_id : Joi.string().optional(),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional(),
          title : Joi.string().optional(),
          time_zone :  Joi.string().optional(),
          description : Joi.string().optional(),
          start_date : Joi.string().optional().description("FORMAT YYYY/MM/DD"),
          end_date : Joi.string().optional().description("FORMAT YYYY/MM/DD"),
          start_time : Joi.string().optional().description("TIME FORMAT HH:MM"),
          end_time : Joi.string().optional().description("TIME FORMAT HH:MM"),
          call_link : Joi.string().optional(),
          member_id : Joi.array().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger":{ 
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path :"/User/listMeetings",
    options : {
      description : "API listing of all the meetings",
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      tags : ["api"],
      handler : (request,reply) => {
        return Controller.userController.list_all_meetings(request.query,request.auth.credentials)
        .then(respond =>{
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : { 
        query : {
          _id : Joi.string().optional().description("enter meeting _id here"),
          pageNumber : Joi.string().optional(),
          status : Joi.string().required().valid("upcoming","completed"),
          company_id : Joi.string().required(),
          compny_address_id : Joi.string().required()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/listMeetingDetails",
    options : {
      description : "lisitng of meeting detail with members API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_meeting_members(request.query,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ;
        });
      },
      validate : {
        query : {
          _id : Joi.string().required().description("Add meeting _id here plz")
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
            "hapi-swagger" : {
                  payloadType : "form",
                  responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
            }
      }
    }
  },
  {
        method  :"PUT",
        path : "/User/deleteMeeting",
        options : {
              description : "API deleting a meeting",
              tags  : ["api"],
              auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
              handler : (request,reply) =>{
                    return Controller.userController.delete_meeting(request.payload,request.auth.credentials)
                    .then(respond => {
                          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
                    }).catch(error =>{
                          return UniversalFunctions.sendError("enn",error,reply) ;
                    });
              },
              validate : {
                    payload : {
                          _id : Joi.string().required().description("add meeting _id here "),
                          is_deleted : Joi.boolean().optional()
                    },
                    headers : UniversalFunctions.authorizationHeaderObj,
                    failAction : UniversalFunctions.failActionFunction
              },
              plugins : {
                    "hapi-swagger" : {
                          payloadType  : "form",
                          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
                    }
              }
        }
  },
  {
    method : "GET",
    path : "/User/list/notifcations",
    options  : {
      description : "listing of all the notiifications API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_notification(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          skipPage : Joi.number().optional().description("skip page") 
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/count/unReadNotifcations",
    options  : {
      description : "listing of all the unread notiifications API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_unread_notification(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {},
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/delete/notifcations",
    options  : {
      description : "Deleting notiifications API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.delete_notifcations(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : {
         _id : Joi.string().optional().description("add notification _id to delete specific _id"),
         is_deleted : Joi.boolean().optional()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/review/TaskStatus",
    options : {
      description : "reviewing task by admin API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.task_review_by_admin(request.payload,request.auth.credentials)
        .then((respond) => {
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error) => {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : {
          task_id : Joi.string().required().description("enter task _id here"),
          member_id : Joi.string().optional().description("enter the member_id here"),
          task_completed : Joi.boolean().optional().description("to use this to reject task by user"),
          task_completed_by_admin : Joi.boolean().optional(),
          notification_id : Joi.string().optional().description("enter the notification _id where action is happening")
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger" : {
          payloadType  : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/searchData",
    options  : {
      description : "searching of data API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.search_data(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : { 
          search  : Joi.string().optional(),
          search_type : Joi.string().optional().valid("All","Contact","Channel","Polls","Task","Meeting"),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/add/edit/Q&A",
    options  : {
      description : "add ques & ans API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.add_edit_ques_ans(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : { 
          _id : Joi.string().optional().description("_id for editing specific question"),
          question : Joi.array().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/Q&A",
    options  : {
      description : "listing of ques & ans API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_ques_ans(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          _id : Joi.string().optional().description("to get specific data by _id"),
          skip_page : Joi.number().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/delete/Q&A",
    options  : {
      description : "deletion of ques & ans API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.delete_ques_ans(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : {
          _id : Joi.array().required(),
          is_deleted : Joi.boolean().required()
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/unassignQ&A",
    options  : {
      description : "unassign ques & ans fromusers API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.unassign_qa_from_user(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : { 
          ques_id   : Joi.string().required().description("add ques _id here"),
          member_id : Joi.string().required().description("add those member _id here"),
          is_deleted : Joi.boolean().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  
  {
    method : "POST",
    path : "/User/assignQ&A",
    options  : {
      description : "assigning ques & ans to users API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.assign_ques_ans(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : { 
          ques_id   : Joi.array().required().description("add ques _id here"),
          member_id : Joi.array().required().description("add those member _id here"),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/respondQ&A",
    options  : {
      description : "responding to ques & ans API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.respond_to_ques_ans(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : { 
          all_data : Joi.array().items(Joi.object().keys({
            ques_ans_id : Joi.string().required().description("add the ques_ans_id"),
            respond   : Joi.string().required(),
          }))
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/respondQ&A",
    options  : {
      description : "listing of every ques & ans responded by user API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_ques_ans_respond_by_member(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          member_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/assignedQ&A",
    options  : {
      description : "listing of every ques & ans assigned to user API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_ques_ans_user_side(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {},
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/userQ&A",
    options  : {
      description : "listing of every ques count & ans count assigned to user API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_all_ques_responded_with_count(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          compny_address_id : Joi.string().optional(),
          company_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/filterTasks",
    options : {
      description : "filtering of task API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.filter_tasks(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply);
        });
      },
      validate : {
        query : {
          title : Joi.string().optional(),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional() ,
          end_date : Joi.string().optional().description("YYYY/MM/DD format"),
          start_date : Joi.string().optional().description("YYYY/MM/DD format"),
          department_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/filterPolls",
    options : {
      description : "filtering of Polls API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.filter_polls(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply);
        });
      },
      validate : {
        query : {
          question : Joi.string().optional(),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional() ,
          end_date : Joi.string().optional().description("YYYY/MM/DD format"),
          start_date : Joi.string().optional().description("YYYY/MM/DD format"),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/filterMeetings",
    options : {
      description : "filtering of Meetings API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.filter_meetings(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply);
        });
      },
      validate : {
        query : {
          title : Joi.string().optional(),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional() ,
          end_date : Joi.string().optional().description("YYYY/MM/DD format"),
          start_date : Joi.string().optional().description("YYYY/MM/DD format"),
          department_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/pollsCount",
    options : {
      description : "count of Polls API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.get_all_question_count(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply);
        });
      },
      validate : {
        query : {
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger": {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path :"/User/sendMessage",
    options :{
      description : "sending message API",
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      tags : ["api"],
      handler : (request,reply) => {
        return Controller.userController.send_message(request.payload,request.auth.credentials)
        .then((respond) => {
          return UniversalFunctions.sendSuccess('en',SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error) => {
          return UniversalFunctions.sendError('en',error,reply) ;
        })
      },
      validate : {
        payload : {
          
          reciever_id : Joi.string().required(),
          message : Joi.string().required(),
          message_type : Joi.string().required().valid("image","video","text","document"),
          company_id : Joi.string().optional(),
          compny_address_id : Joi.string().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }   
    }
  },
  {
    method: "GET",
    path: "/User/list/conversation",
    options: {
    description: "conversation listing of two users",
    auth: { strategies: [Config.APP_CONSTANTS.SCOPE.USER] },
    tags: ["api"],
    handler: (request, reply) => {
      return Controller.userController.user_message_listing(request.query,request.auth.credentials)
      .then(response => {
        return UniversalFunctions.sendSuccess("en", SUCCESS.DEFAULT, response, reply);
      })
      .catch(error => {
        return UniversalFunctions.sendError("en", error, reply);
      });
    },
    validate: {
      query: {
        reciever_id : Joi.string().optional(),
        channel_id : Joi.string().optional(),
      },
      headers: UniversalFunctions.authorizationHeaderObj,
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        payloadType: "form",
        responseMessages: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
},
{
  method  :"GET",
  path : "/User/list/lastMessages",
  options : {
    description : "listing of last messages API",
    tags : ["api"],
    auth  : {strategies : [Config.APP_CONSTANTS.SCOPE.USER ] },
    handler : (request,reply)=> {
      return Controller.userController.list_last_messages(request.query,request.auth.credentials)
      .then((respond)=>{
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError("en",error,reply);
      });
    },
    validate :{
      query : {
        search : Joi.string().optional(),
        company_id : Joi.string().optional(),

      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction 
    },
    plugins : {
      "hapi-swagger" : {
        payloadType  :  "form",
        responseMessage :Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
},
{
  method : "PUT",
  path : "/User/readMessage",
  options : {
    description : "reading all the unread messages API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.read_messages(request.payload,request.auth.credentials) 
      .then((respond)=> {
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError("en",error,reply) ;
      });
    },
    validate : {
      payload : {
        reciever_id : Joi.string().optional().description("to use in one -to -one chat"),
        channel_id : Joi.string().optional().description("to use in a group chat"),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType  :"form",
        respondMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
},
{
  method : "PUT",
  path : "/User/deleteChats",
  options : {
    description : "deleting chats API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.delete_chats(request.payload,request.auth.credentials) 
      .then((respond)=> {
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError("en",error,reply) ;
      });
    },
    validate : {
      payload : {
        reciever_id : Joi.array().required(),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType  :"form",
        respondMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
},
{
  method : "POST",
  path  :"/User/sendGroupMessage",
  options : {
    description : "sending group chat messsage API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler  :(request,reply) => {
      return Controller.userController.send_group_message(request.payload,request.auth.credentials)
      .then((respond)=> {
        return UniversalFunctions.sendSuccess('en',SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error) => {
        return UniversalFunctions.sendError('en',error,reply) ;
      });
    },
    validate : {
      payload : {
        channel_id : Joi.string().optional("Enter channel _id here") ,
        message : Joi.string().required(),
        message_type : Joi.string().required().valid("image","video","text","document"),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction,
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        respondMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
},
{
  method : "PUT",
  path :"/User/exitChannel",
  options : {
    description : "API exiting or removing a member from channnel",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) =>{
      return Controller.userController.exit_channel(request.payload,request.auth.credentials)
      .then(respond => {
        return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
      }).catch(error => {
        return UniversalFunctions.sendError("enn",error,reply);
      });
    },
    validate : {
      payload :{
        member_id : Joi.string().optional().description("to remove member from channel use this key"),
        company_id : Joi.string().required(),
        compny_address_id : Joi.string().optional().description("compny addrsss _id"),
        company_channels_id : Joi.string().required().description("enter _id of channel"),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
      }
    }
  }
},
{
  method : "PUT",
  path :"/User/makeChannelAdmin",
  options : {
    description : "API making an Admin of the channel",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) =>{
      return Controller.userController.make_channel_admin(request.payload,request.auth.credentials)
      .then(respond => {
        return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
      }).catch(error => {
        return UniversalFunctions.sendError("enn",error,reply);
      });
    },
    validate : {
      payload:{
        member_id : Joi.string().required() ,
        is_admin : Joi.boolean().optional(),
        company_channels_id : Joi.string().required().description("enter _id of channel"),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
      }
    }
  }
},
{
  method : "GET",
  path : "/User/channelDetail",
  options : {
    description : "API complete detail of the channel by _id",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler :(request,reply) => {
      return Controller.userController.channel_detail(request.query,request.auth.credentials)
      .then((respond)=> {
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
      }).catch((error )=>{
        return UniversalFunctions.sendError("en",error,reply);
      });
    },
    validate : {
      query : {
        _id : Joi.string().required().description("enter the compny Channel Id "),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction,
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "GET",
  path : "/User/list/userProfile",
  options : {
    description : "listing of the profile of user API",
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    tags : ["api"],
    handler : (request,reply) =>{
      return Controller.userController.get_user_detail(request.query,request.auth.credentials)
      .then(response => {
        return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
      }).catch(error => {
        return UniversalFunctions.sendError("enn",error,reply) ;
      }) ;
    },
    validate : {
      query : {
        _id : Joi.string().required().description("enter the _id of user whom yu want to see profile")
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "POST",
  path : "/User/addParticipent",
  options : {
    description : "API adding participent in channel", 
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler :(request,reply) => {
      return Controller.userController.add_participent(request.payload,request.auth.credentials)
      .then((respond)=> {
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
      }).catch((error )=>{
        return UniversalFunctions.sendError("en",error,reply);
      });
    },
    validate : {
      payload : {
        company_channels_id : Joi.string().required(),
        member_id : Joi.array().required(),
        company_id: Joi.string().required(),
        compny_address_id : Joi.string().required(),
      },
      headers : UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction,
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "PUT",
  path :"/User/onOffNoti",
  options : {
    description : " ON/OFF notifications",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.on_off_notifications(request.payload,request.auth.credentials)
      .then((respond)=>{
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError('en',error,reply);
      });
    },
    validate : {
      payload : {
        _id : Joi.string().required().description("enter channel_id here"),
        notification_allowed : Joi.boolean().optional()
      },
      headers  :UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "PUT",
  path :"/User/add_money_to_wallet",
  options : {
    description : "add money to wallet API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.add_money_to_wallet(request.payload,request.auth.credentials)
      .then((respond)=>{
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError('en',error,reply);
      });
    },
    validate : {
      payload : {
        ammount : Joi.number().required(),
      },
      headers  :UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "POST",
  path :"/User/send_money_to_user_from_wallet",
  options : {
    description : "send_money_to_user_from_wallet API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.send_money_to_user_from_wallet(request.payload,request.auth.credentials)
      .then((respond)=>{
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError('en',error,reply);
      });
    },
    validate : {
      payload : {
        sender_id : Joi.string().required().description("whom you want to send money"),
        ammount : Joi.number().required(),
        hashtag : Joi.string().required(),
      },
      headers  :UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
{
  method : "GET",
  path :"/User/wallet_history",
  options : {
    description : "wallet_history API",
    tags : ["api"],
    auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
    handler : (request,reply) => {
      return Controller.userController.wallet_history(request.query,request.auth.credentials)
      .then((respond)=>{
        return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
      }).catch((error)=> {
        return UniversalFunctions.sendError('en',error,reply);
      });
    },
    validate : {
      query : {
        status : Joi.string().required().valid("credit","debit"),
      },
      headers  :UniversalFunctions.authorizationHeaderObj,
      failAction : UniversalFunctions.failActionFunction
    },
    plugins : {
      "hapi-swagger" : {
        payloadType : "form",
        responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
      }
    }
  }
},
  { 
    method : "GET",
    path : "/User/list/hashtags",
    options : {
      description : "listing of hashtags API",
      tags : ["api"],
      auth : false,
      handler :(request,reply) => {
        return Controller.userController.list_hashtags(request.query)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ; d
        });  
      },
      validate : {
        query : {
          _id : Joi.string().optional().description("use _id for specific data"),
          skip_page : Joi.number().optional() ,
        },
        // headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/vouchers",
    options : {
      description : "listing of vouchers API",
      tags : ["api"],
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.USER ] },
      handler :(request,reply) => {
        return Controller.adminController.list_vouchers(request.query,request.auth.credentials)
        .then(respond => {
          return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
        }).catch(error => {
          return UniversalFunctions.sendError("enn",error,reply) ; d
        });  
      },
      validate : {
        query : {
          _id : Joi.string().optional().description("use _id for specific data"),
          skip_page : Joi.number().optional() ,
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction,
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path :"/User/reedem_vouchers",
    options : {
      description : "reedem vouchers API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.reedem_vouchers(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          voucher_id : Joi.string().required(),
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/leaderboard",
    options  : {
      description : "listing of leaderboard API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_leaderboard(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          company_id : Joi.string().required(),
          compny_address_id :  Joi.string().required(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path :"/User/react/reply/message",
    options : {
      description : "react or reply to a message API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.react_to_message(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          message_id : Joi.string().required().description("add message _id here"),
          emoji : Joi.string().optional(),
          message : Joi.string().optional(),
          reply_id : Joi.string().optional(),
          reply_reaction :  Joi.string().optional(),
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/reply/message",
    options : {
      description : "listing of reply to a message API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.list_of_reacted_message(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        query : {
          conversation_id : Joi.string().required().description("add message _id here"),
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/reply/message",
    options : {
      description : "reply of a message API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.reply_to_message(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          // channel_id : Joi.string().optional().description("add channel _id here"),
          conversation_id : Joi.string().required().description("add message _id here"),
          message : Joi.string().required(),
          message_type : Joi.string().required().valid("image","video","text","document"),
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/members_of_company",
    options : {
      description : "list_all_members_of_compnay API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.list_all_members_of_compnay(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        query : {
          company_id : Joi.string().optional(),
        },
      
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/deleted_channel_for_admin",
    options : {
      description : "deleted channel list for admin API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.deleted_channel_list_for_admin(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        query : {
          company_address_id : Joi.string().required(),
          company_id : Joi.string().required(),
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "PUT",
    path : "/User/delete/channel_permanent",
    options : {
      description : "reply of a message API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.delete_channel_permanently_as_admin(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        query : {
          channel_ids : Joi.array().required().description("add channel _id here")
        },
        headers  :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method :"GET",
    path :"/User/accept_reject_meet",
    options : {
      description :"either join or reject meeting",
      tags : ["api"],
      auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.accept_reject_meeting(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        query : {
          meeting_id : Joi.string().required().description("add meeting_id here"),
          invite : Joi.string().required().valid("accept","reject"),
        },
        headers :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method :"PUT",
    path :"/User/delete_message",
    options :{ 
      description : "delete a message API" ,
      tags :["api"],
      auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.delete_message(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          message_id : Joi.string().required().description("add message id  here"),
        },
        headers :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/share_message",
    options : { 
      description : "share a message API" ,
      tags :["api"],
      auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.share_message(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          channel_id : Joi.string().optional().description("add channel id  here"),
          reciever_id : Joi.string().optional(),
          message : Joi.string().required(),
          message_type : Joi.string().required().valid("image","video","text","document"),
        },
        headers :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/filter/leaderboard",
    options  : {
      description : "filter in leaderboard API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.filtered_leaderboard(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          compny_address_id :  Joi.string().required(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/save_unsave_message",
    options : { 
      description : "save  or unsave a message API" ,
      tags :["api"],
      auth :{strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) => {
        return Controller.userController.save_unsave_chats(request.payload,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply) ;
        }).catch((error)=> {
          return UniversalFunctions.sendError('en',error,reply);
        });
      },
      validate : {
        payload : {
          message_id : Joi.string().optional().description("add message id  here"),
          is_saved : Joi.boolean().optional() ,
        },
        headers :UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins : {
        "hapi-swagger" : {
          payloadType : "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
        }
      }
    }
  },
  {
    method : "GET",
    path : "/User/list/saved_message",
    options  : {
      description : "listing of saved messages API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.USER]},
      handler : (request,reply) =>{
        return Controller.userController.list_saved_message(request.query,request.auth.credentials)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        query : {
          skip_num :  Joi.number().optional(),
        },
        headers : UniversalFunctions.authorizationHeaderObj,
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },
  {
    method : "POST",
    path : "/User/contact_us",
    options  : {
      description : "listing of contact_us messages API",
      tags : ["api"],
      auth : false,
      handler : (request,reply) =>{
        return Controller.userController.contact_us(request.payload)
        .then((respond)=>{
          return UniversalFunctions.sendSuccess("en",SUCCESS.DEFAULT,respond,reply);
        }).catch((error)=> {
          return UniversalFunctions.sendError("en",error,reply) ;
        });
      },
      validate : {
        payload : {
          name : Joi.string().required(),
          email : Joi.string().required(),
          message : Joi.string().required(),

        },
        failAction : UniversalFunctions.failActionFunction
      },
      plugins  :{
        "hapi-swagger" :{
          payloadType: "form",
          responseMessage : Config.APP_CONSTANTS.swaggerDefaultRespondMessagess
        }
      }
    }
  },


  
  
// {
//   method : "PUT",
//   path : "/User/clearChat",
//   options :{
//     descriptio
//   }
// }
];
