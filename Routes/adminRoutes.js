var Controller = require("../Controller");
var UniversalFunctions = require("../Utils/UniversalFunctions");
var Joi = require("joi");
var Config = require("../Config");
var SUCCESS = Config.responseMessages.SUCCESS;
var ERROR = Config.responseMessages.ERROR;

module.exports = [
      {
            method: 'POST',
            path: '/Admin/imageUpload',
            options: {
                  description: 'Admin image upload  Api',
                  auth : false,
                  payload : {
                  maxBytes : 1024 * 1024 * 1000,
                  timeout  : false
                  },
                  tags: ['api'],
                  handler: (request, reply) => {
                  return Controller.adminController.imageUpload(request.payload)
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
                        image : Joi.any().meta({ swaggerType : 'file' }).optional().description('Image File'),
                        audio  : Joi.any().meta({ swaggerType : 'file' }).optional().description('Audio File'),
                        video  : Joi.any().meta({ swaggerType : 'file' }).optional().description('Video File'),
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
//     Admin login
      {
            method: "POST",
            path: "/Admin/Login",
            options: {
                  description: "Admin Login Api",
                  auth: false,
                  tags: ["api"],
                  handler: (request, reply) => {
                  return Controller.adminController.adminLogin(request.payload)
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
                  email: Joi.string().email().required().description("Enter your Email Address"),
                  password: Joi.string().required().description("Enter your Password")
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
            path : "/Admin/addDepartments",
            options : {
                  description : "add or edit departments",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.add_edit_departments(request.payload,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },validate : {
                        payload : {
                              _id : Joi.string().optional().description("_id of specific department"),
                              name : Joi.string().optional(),
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
            path : "/Admin/listDepartments",
            options : {
                  description : "listing of departments",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.list_departments(request.query,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },validate : {
                        query : {
                              _id : Joi.string().optional().description("_id of specific department"),
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
            path : "/Admin/deleteDepartment",
            options : {
                  description : "delete any departments",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.delete_departments(request.payload,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },validate : {
                        payload : {
                              _id : Joi.string().optional().description("_id of specific department"),
                              is_deleted : Joi.boolean().required(),
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
            path : "/Admin/addPlans",
            options : {
                  description : "add or edit plans",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.add_edit_plans(request.payload,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },validate : {
                        payload : {
                              _id : Joi.string().optional().description("add _id to edit a plan"),
                              name : Joi.string().optional(),
                              currency : Joi.string().optional(),
                              type : Joi.string().optional().valid("monthly","daily","quarterly"),
                              price : Joi.number().optional(),
                              discounted_price : Joi.number().optional(),
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
            path : "/Admin/listPlans",
            options : {
                  description : "listing of plans",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.list_plans(request.query,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },validate : {
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
            method : "GET",
            path : "/Admin/userList",
            options  :{ 
                  description : "listing of all the users",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]} ,
                  handler : (request,reply) => {
                        return Controller.adminController.user_listing(request.query,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        }); 
                  },
                  validate : {
                        query : {
                              _id : Joi.string().optional().description("to fetch specific user by _id"),
                              search : Joi.string().optional().description("search by name or email"),
                              skipPage : Joi.number().optional()
                        },
                        headers : UniversalFunctions.authorizationHeaderObj,
                        failAction : UniversalFunctions.failActionFunction,
                  },
                  plugins : {
                        "hapi-swagger" : {
                              payloadType  :"form",
                              responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                        }
                  }
            }
      },
      {
            method : "PUT",
            path : "/Admin/deleteBlockUsers",
            options : {
                  description : "delete or block users API",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.delete_block_users(request.payload,request.auth.credentials) 
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ; 
                        }) ;
                  },
                  validate : {
                        payload : {
                              _id : Joi.string().required().description("enter the user _id to delete or block"),
                              isDeleted : Joi.boolean().optional(),
                              isBlocked : Joi.boolean().optional()
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
            path : "/Admin/addEditStatus",
            options : {
                  description : "add or edit status API",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.add_edit_status(request.payload,request.auth.credentials)
                        .then(response => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error ,reply) ;
                        }) ;
                  },
                  validate : {
                        payload : {
                              _id : Joi.string().optional().description("to edit specific name use _id "),
                              name : Joi.string().required().description("name of the status"),
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
            path : "/Admin/listStatus",
            options : {
                  description : "Listing of all the statuses API",
                  tags : ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler :(request,reply) =>{
                        return Controller.adminController.list_status(request.query,request.auth.credentials)
                        .then(response =>{
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        query : {
                              _id : Joi.string().optional().description("enter the _id to chcek spcific data"),
                              skip_page : Joi.number().optional()
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
            path : "/Admin/deleteStatus",
            options : {
                  description : "deleting specific status API",
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  tags : ["api"],
                  handler :(request,reply) => {
                        return Controller.adminController.delete_status(request.payload,request.auth.credentials)
                        .then(response =>{
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                        }).catch(error =>{
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        payload : {
                              _id : Joi.string().required().description("enter _id of thr name to be deleted"),
                              is_deleted : Joi.boolean().optional()
                        },
                        headers :  UniversalFunctions.authorizationHeaderObj,
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
            path : "/Admin/aboutUs",
            options : {
                  description : "add or edit about us API",
                  tags : ["api"],
                  auth :{strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply)=>{
                        return Controller.adminController.add_edit_about_us(request.payload,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        payload : {
                              about: Joi.string().required().description("enter all data here")
                        },
                        headers : UniversalFunctions.authorizationHeaderObj,
                        failAction : UniversalFunctions.failActionFunction ,
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
            path : "/Admin/list/aboutUs",
            options : {
                  description : "listing of about us",
                  tags : ["api"],
                  auth :{strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) => {
                        return Controller.adminController.list_about_us(request.query,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        query : {},
                        headers : UniversalFunctions.authorizationHeaderObj,
                        failAction : UniversalFunctions.failActionFunction ,
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
            path : "/Admin/termsAndConditions",
            options : {
                  description : "add or edit terms & conditions us API",
                  tags :  ["api"],
                  auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
                  handler : (request,reply) =>{
                        return Controller.adminController.add_edit_terms(request.payload,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply) ;
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        payload : {
                              terms : Joi.string().required()
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
            path : "/Admin/list/terms",
            options : {
                  description : "listing of terms & conditions API",
                  tags : ["api"],
                  auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
                  handler :(request,reply) => {
                        return Controller.adminController.list_terms(request.query,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ; d
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
                              responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                        }
                  }
            }
      },
      {
            method : "POST",
            path  : "/Admin/addPolicies",
            options : {
                  description : "add or edit policies API",
                  tags : ["api"],
                  auth  : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
                  handler : (request,reply) => {
                        return Controller.adminController.add_edit_policies(request.payload,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ;
                        });
                  },
                  validate : {
                        payload : {
                              policy : Joi.string().required()
                        },
                        headers : UniversalFunctions.authorizationHeaderObj,
                        failAction : UniversalFunctions.failActionFunction,
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
            path : "/Admin/list/policies",
            options : {
                  description : "listing of privacy policies API",
                  tags : ["api"],
                  auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
                  handler :(request,reply) => {
                        return Controller.adminController.list_policies(request.query,request.auth.credentials)
                        .then(respond => {
                              return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
                        }).catch(error => {
                              return UniversalFunctions.sendError("enn",error,reply) ; d
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
                              responseMessages : Config.APP_CONSTANTS.swaggerDefaultResponseMessagess
                        }
                  }
            }
      },
      {
        method : "POST",
        path : "/Admin/add/edit/delete/hashtags",
        options : {
          description : "add or edit or delete hashtags API",
          tags : ["api"],
          auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
          handler : (request,reply) => {
                return Controller.adminController.add_edit_delete_hastags(request.payload,request.auth.credentials)
                .then(response => {
                      return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
                }).catch(error => {
                      return UniversalFunctions.sendError("enn",error ,reply) ;
                }) ;
          },
          validate : {
                payload : {
                      _id : Joi.string().optional().description("to edit or delete specific name use _id "),
                      name : Joi.string().optional().description("name of the hashtag"),
                      is_deleted : Joi.boolean().optional() 
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
        path : "/Admin/list/hashtags",
        options : {
          description : "listing of hashtags API",
          tags : ["api"],
          auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
          handler :(request,reply) => {
                return Controller.adminController.list_hashtags(request.query)
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
    path : "/Admin/add/edit/delete/vouchers",
    options : {
      description : "add or edit or delete vouchers API",
      tags : ["api"],
      auth : {strategies : [Config.APP_CONSTANTS.SCOPE.ADMIN]},
      handler : (request,reply) => {
            return Controller.adminController.add_edit_delete_vouchers(request.payload,request.auth.credentials)
            .then(response => {
                  return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,response,reply) ;
            }).catch(error => {
                  return UniversalFunctions.sendError("enn",error ,reply) ;
            }) ;
      },
      validate : {
            payload : {
                  _id : Joi.string().optional().description("to edit or delete specific data use _id "),
                  name : Joi.string().optional(),
                  image : Joi.string().optional(),
                  ammount : Joi.number().optional(),
                  is_deleted : Joi.boolean().optional() 
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
    path : "/Admin/list/vouchers",
    options : {
      description : "listing of vouchers API",
      tags : ["api"],
      auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
      handler :(request,reply) => {
        return Controller.adminController.list_vouchers(request.query)
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
      method : "GET",
      path : "/Admin/queries_listing",
      options : {
        description : "listing of queries_listing API",
        tags : ["api"],
        auth : { strategies : [ Config.APP_CONSTANTS.SCOPE.ADMIN ] },
        handler :(request,reply) => {
          return Controller.adminController.queries_listing(request.query)
          .then(respond => {
            return UniversalFunctions.sendSuccess("enn",SUCCESS.DEFAULT,respond,reply);
          }).catch(error => {
            return UniversalFunctions.sendError("enn",error,reply) ; d
          });  
        },
        validate : {
          query : {
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
  
      
];
