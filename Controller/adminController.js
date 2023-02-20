const { queryStringToSign } = require("knox/lib/auth");
const { model } = require("mongoose");


const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  aws3 = Config.awsS3Config.s3BucketCredentials,   
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),

  commonController = require("./commonController"),
  moment = require('moment'),

  UniversalFunctions = require("../Utils/UniversalFunctions");
notificationController = require("./notificationController");
var randomstring = require("randomstring");
const AWS = require('aws-sdk');

const imageUpload = async (payloadData) => {
    try {

      console.log(" payloadData.audio ====>", payloadData)
      const s3 = new AWS.S3({
  
        bucket: aws3.bucket,
        accessKeyId: aws3.accessKeyId,
        secretAccessKey:aws3.secretAccessKey,
        folder: {
          profilePicture : "profilePicture",
          thumb : "thumb"
        }
      });
      let data
      let name = ''
      if(payloadData.image){
        data = payloadData.image
        name = "IMAGE" + randomstring.generate(7)+ ".jpg";
     }

     if(payloadData.audio){ 
        data = payloadData.audio
        name = "AUDIO" + randomstring.generate(7) + ".mp3";

     }
     if(payloadData.pdf){ 
        data = payloadData.pdf
        name = "PDF" + randomstring.generate(7) + ".pdf";

     }
     if(payloadData.video){
        data = payloadData.video
   
        name = "VIDEO" + randomstring.generate(7)+ ".mp4";
     }
      
          
      let params = {
        Bucket: aws3.bucket, 
        Key : name,
        Body: data,
      };
       console.log(params)
       const data1 = await s3.upload(params).promise()
       const { Location } = data1
       
       return Location
    
    } catch (err) {
      throw err;
    }
}

const adminLogin = async paylaodData => {
    try {
        let checkAdmin = await DAO.getData(Models.admins,{ email: paylaodData.email},{},{ lean: true });
        
        if (!checkAdmin.length) {
            throw ERROR.INVALID_OBJECT_ID;
        }

        if (!(checkAdmin[0].password == paylaodData.password)) {
            throw ERROR.WRONG_PASSWORD;
        }

        checkAdmin = checkAdmin[0];

        if (checkAdmin._id) {
            let tokenData = {
                scope: Config.APP_CONSTANTS.SCOPE.ADMIN,
                _id: checkAdmin._id,
                time: +new Date()
            }

            let accessToken = await TokenManager.generateToken(
                tokenData,
                Config.APP_CONSTANTS.SCOPE.ADMIN
            );
            if (accessToken == null) {
                throw ERROR.DEFAULT;
            }
            let tokenResult = await DAO.findAndUpdate(
                Models.admins,{ _id: checkAdmin._id },
                {
                accessToken: accessToken,
                time : tokenData.time
                },
                {  new: true }
            );

            return tokenResult;

        }else {
            throw ERROR.DB_ERROR;
        }
    }catch (err){
        throw err;
    }
};


const add_edit_departments = async(payloadData) => {
      try{
            let Model = Models.departments ;

            let data = {
                  name : payloadData.name
            };
            if(payloadData._id) {
                  /**** to edit the specifiic name by _id ****** */
                  
                  let condition = { _id : payloadData._id } ;

                  let options = { new : true } ;
                  
                  let update_current_data = await DAO.findAndUpdate(Model,condition,data,options) ;
                  return update_current_data ;
            }else{
                  /***************** to save details  ************** */
                  let save_data = await DAO.saveData(Model,data) ;
                  return save_data  ;
            } 
      }catch(err){
            throw err ;
      }
};

const list_departments = async(payloadData) =>{ 
      try{
            let Model = Models.departments ;
            let query = {
                  is_deleted : false
            };
            if(payloadData._id){
                  /******** to fetch specific dept. by _id ********/ 

                  query = { 
                        is_deleted : false,
                        _id : payloadData._id
                  }; 
            };
            
            let projection = {__v : 0 } ;
            
            let options = { new : true } ;
            let Number = 0 ;
            if(payloadData.pageNumber){
                  Number = payloadData.pageNumber 
            };

            let fetch_details = await DAO.getDataUser(Model,query,projection,options,Number) ;

            let fetch_data = await DAO.getData(Model,query,projection,options) ;
            
            return {
                  Count : fetch_data.length,
                  fetch_details
            };
      }catch(err){
            throw err ;
      }
};

const delete_departments = async(payloadData) => {
      try{
            let Model = Models.departments ;
            
            let conditons = {
                  _id : payloadData._id
            };

            let data_to_update = {} ;

            if(payloadData.is_deleted == true || payloadData.is_deleted == false) {
                  data_to_update.is_deleted = payloadData.is_deleted ;
            };

            let fetch_updated_data = await DAO.findAndUpdate(Model,conditons,data_to_update,{ new : true }) ;

            return fetch_updated_data ;
      }catch(err) {
            throw err ;
      };
};

const add_edit_plans = async(payloadData) => {
      try{
            let Model = Models.plans ;
            
            let data_for_save = {} ;
            if(payloadData.name){ data_for_save.name = payloadData.name};
            if(payloadData.currency){ data_for_save.currency = payloadData.currency};
            if(payloadData.type){ data_for_save.type = payloadData.type  } ;
            if(payloadData.price){ data_for_save.price = payloadData.price  } ;
            if(payloadData.discounted_price){ data_for_save.discounted_price = payloadData.discounted_price  } ;
            
            if(payloadData._id) {
                  /* ------ if there is data already edit it --------*/
                  let condition_for_update = {
                        _id : payloadData._id,
                        is_deleted : false
                  };
                  let update_data = await DAO.findAndUpdate(Model,condition_for_update,data_for_save,{new : true }) ;
                  return update_data ;
            }else{
                  /*-------- to save new data -------- */
                  let save_plan_data = await DAO.saveData(Model,data_for_save) ;
                  return save_plan_data ;
            };
      }catch(err){
            throw err ;
      };
};

const list_plans = async(payloadData,userData) => {
      try{
            let Model = Models.plans ;
            let query = {
                  is_deleted : false
            } ;
            let fecth_plans = await DAO.getData(Model,query,{__v : 0}, {lean : true}) ;
            return fecth_plans ;
      }catch(err){
            throw err ;
      }
};

const user_listing = async(payloadData) => {
  try{
        let Model = Models.users  ;
        let query = {
              isDeleted : false
        };
        if(payloadData._id){
              /********** to get specific _id*****************/
              query = {
                    isDeleted : false,
                    _id : payloadData._id,
              };
        };
        if(payloadData.search){
              /* ********* to search by name or email **************** */
              let  searches = payloadData.search.trim() ;
              query = {
                    $or : [
                          {firstName : { $regex : searches , $options : "i"} },
                          { email : { $regex : searches, $options : "i"} }
                    ],
                    isDeleted : false
              };
        };

        let projection = {__v : 0 } ;
        let option = {lean : true } ;

        let Number  = 0 ;
        if(payloadData.skipPage){
              /**** skip number */
              Number = payloadData.skipPage 
        } ;

        let get_count = await DAO.getData(Model,query,projection,option) ;
        let fetch_all_data = await DAO.getDataUser(Model,query,projection,option,Number) ;

        return {  
              Count : get_count.length , 
              fetch_all_data
        }
  }catch(err){
    throw err ;
  };
};

const delete_block_users = async(payloadData) => {
      try{
            let query = {
                  _id : payloadData._id
            };
            let updated_data = {} ;
            if(payloadData.isDeleted === true ||payloadData.isDeleted === false ){
                  updated_data.isDeleted = payloadData.isDeleted  ;
            };
            if(payloadData.isBlocked === true || payloadData.isBlocked === false){
                  updated_data.isBlocked = payloadData.isBlocked  ;
            };

            let return_update_data  = await DAO.findAndUpdate(Models.users,query,updated_data,{ new : true }) ;
            return return_update_data ;
      }catch(err){
            throw err ;
      };
};

const add_edit_status = async(payloadData) => {
      try{
            let data_to_save = {} ;
            
            let chcek_if_status_name_exist = await commonController.check_exist_status(payloadData.name) ;
            if(chcek_if_status_name_exist.length != 0){
                  throw ERROR.DUPLICATE_STATUS_NAME ;
            }else{
                  data_to_save.name = payloadData.name
            };

            if(payloadData._id){
                  /* ********* to edit data by _id ******* */
                  let query = {
                        _id : payloadData._id,
                        is_deleted : false
                  };
                  let update_name = await DAO.findAndUpdate(Models.status,query,data_to_save,{ lean : true }) ;
                  return  update_name ;
            }else{
                  /* ********* to save data ******* */
                  let save_data = await DAO.saveData(Models.status,data_to_save) ;
                  return save_data ;
            };
      }catch(err){
            throw err ;
      };
};

const list_status = async(payloadData) =>{
      try{
            let query = { is_deleted : false } ;

            /* ******** to fetch specific data based on _id ***** */
            if(payloadData._id){
                  query = {
                        _id : payloadData._id ,
                        is_deleted : false
                  };
            };
            /***** send skip numbers ******** */
            let number = 0 ;
            if(payloadData.skip_page){
                  number = payloadData.skip_page ;
            };
            let fetch_data = await DAO.getDataUser(Models.status,query,{__v : 0},{lean : true},number) ;

            let fetch_all_data = await DAO.getData(Models.status,query,{ __v : 0 }, {lean : true}) ;

            return {
                  Count : fetch_all_data.length ,
                  fetch_data 
            }
      }catch(err){
            throw err ;
      };
};

const delete_status = async(paylaodData) => {
      try{
            let queries = { _id : paylaodData._id  } ;
            let update_current_data = {} ;
            /****** to delete specific status by _id *******/
            if(paylaodData.is_deleted === true || paylaodData.is_deleted === false){
                  update_current_data.is_deleted = paylaodData.is_deleted
            };                
            let deleted_status = await DAO.findAndUpdate(Models.status,queries,update_current_data,{new : true}) ;
            return deleted_status ;
      }catch(err){
            throw err ;
      };
};

const add_edit_tutorial_screens = async(payloadData,userData) =>{
      try{
            let data_to_save = {} ;

            if(payloadData.image){  data_to_save.image = payloadData.image  } ;
            if(payloadData.title){  data_to_save.title = payloadData.title  } ;
            if(payloadData.description){  data_to_save.description = payloadData.description  } ;

            if(payloadData._id){
                  /*** to edit specific data by _id */
                  let condition =  { _id : payloadData._id } ;
                  let update_data = await DAO.findAndUpdate(Models.tutorials,condition,data_to_save,{ new : true })  ;
                  return update_data ;
            }else{
                  /******* to save new data ******/
                  let save_data = await DAO.saveData(Models.tutorials,data_to_save ) ;
                  return save_data  ;
            };
      }catch(err){
            throw err ;
      };
};
const list_tutorial_screens = async(paylaodData,userData) => {
      try{
            let query = { is_deleted : false } ;
            if(paylaodData._id){
                  /*** to fetch specific data by _id *****/
                  query = {
                        _id : paylaodData._id,
                        is_deleted : false
                  };
            };
            let projection = {__v : 0} ;
            let option = {new : true } ;

            let fetch_all_screens = await DAO.getData(Models.tutorials,query,projection,option) ;
            return fetch_all_screens ;     
      }catch(err){
            throw err ;
      };
};

const delete_tutorial_screen = async(payloadData,userData) => {
      try{
            let condition = {_id : payloadData._id} ;

            let data_to_update = {} ;
            /**** to delete specific tutorial screen *****/
            if(payloadData.is_deleted === true || payloadData.is_deleted === false){
                  data_to_update.is_deleted =  payloadData.is_deleted ;
            };
            let delete_specific_screen = await DAO.findAndUpdate(Models.tutorials,condition,data_to_update,{ new : true }) ;
            return delete_specific_screen ;
      }catch(err){
            throw err ;
      };
};

const add_edit_about_us = async(payloadData,userData) => {
      try{
            let query = {is_deleted : false} ;
            var data = {
                  about : payloadData.about    
            } ;
            let fetch_all_data = await DAO.getData(Models.about_us,query,{ _id : 1 },{ lean : true });
            if(fetch_all_data.length != 0){
                  /*** if theres already data udpate it */
                  let condition_for_update= {
                        _id : fetch_all_data[0]._id
                  };
                  let udpate_data = await DAO.findAndUpdate(Models.about_us,condition_for_update,data,{new  : true}) ;
                  return udpate_data ;
            }else{
                  /** save new data **/ 
                  let save_data = await DAO.saveData(Models.about_us,data) ;
                  return save_data ;
            }
      }catch(err){
            throw err ;
      };
};

const list_about_us = async(payloadData,userData) => {
      try{
            let condition = { is_deleted : false } ;
            var list_all_data  = await DAO.getDataOne(Models.about_us,condition,{about : 1},{ lean : true }) ;
            return list_all_data ;
      }catch(err){
            throw err ;
      };
};

const add_edit_policies = async(payloadData,userData) => {
      try{
            let query = {is_deleted : false} ;
            var data = {
                  policy : payloadData.policy
            }
            let fetch_all_data = await DAO.getData(Models.privacy_policies,query,{_id : 1},{lean : true})  ;
            if(fetch_all_data.length != 0){
                  /*** if exist then update dataa ****/
                  let condition = {
                        _id  : fetch_all_data[0]._id,
                        is_deleted : false
                  };
                  let update_data = await DAO.findAndUpdate(Models.privacy_policies,condition,data,{ new : true }) ;
                  return update_data ;
            }else{
                  /*** if not save data ****/
                  let save_data = await DAO.saveData(Models.privacy_policies,data) ;
                  return save_data ;
            };
      }catch(err){
            throw err ;
      };
};

var list_policies = async(payloadData,userData) => {
      try{
            let query = { is_deleted : false } ;
            var fetch_all_policies = await DAO.getDataOne(Models.privacy_policies,query,{policy : 1},{lean : true}) ;
            return fetch_all_policies ;
      }catch(err){
            throw err ;
      };
};

const add_edit_terms = async(payloadData,userData) =>{
      try{
            let query = {is_deleted : false } ;
            let data = { terms : payloadData.terms } ;

            let fetch_all_data = await DAO.getData(Models.terms_conditions,query,{ _id : 1}, { lean : true }) ;
            if(fetch_all_data.length != 0) {
                  /*** if exist then update dataa ****/
                  let conditions = {
                        _id : fetch_all_data[0]._id,
                        is_deleted : false
                  };
                  let update_terms = await DAO.getData(Models.terms_conditions,conditions,data,{new : true}) ;
                  return update_terms ;
            }else{
                  /*** if not save data ****/
                  let save_terms = await DAO.saveData(Models.terms_conditions,data) ;
                  return save_terms ;
            };
       }catch(err){
            throw err ;
      };
};

const list_terms = async(payloadData,userData) => {
      try{
            let query = { is_deleted : false} ;
            let fetch_all_data = await DAO.getDataOne(Models.terms_conditions,query,{terms : 1},{lean : true }) ;
            return fetch_all_data ;
      }catch(err){
            throw err ;
      };
};

const add_edit_delete_hastags = async(payloadData) =>{
  try{
    let Model = Models.hashtags  ;
    let data= {} ;
    if(payloadData.name){
      data.name = payloadData.name 
    };
    if(payloadData._id){
      let condition= {_id : payloadData._id ,is_deleted : false } ;
      if(payloadData.is_deleted == true || payloadData.is_deleted == false){
        data.is_deleted = payloadData.is_deleted 
      };
      let update_or_delete_data = await DAO.findAndUpdate(Model,condition,data,{ new : true }) ;
      return  update_or_delete_data ;
    }else{
      let save_data = await DAO.saveData(Model,data) ;
      return save_data ;
    }
  }catch(err){
    throw err ;
  }
};

const list_hashtags = async(payloadData) =>{
  try{
    let Model = Models.hashtags  ;
    let query = { is_deleted : false } ;
    /* ******** to fetch specific data based on _id ***** */
    if(payloadData._id){
      query = {  _id : payloadData._id , is_deleted : false  };
    }; 
    /***** send skip numbers ******** */
    let number = 0 ;
    if(payloadData.skip_page){
      number = payloadData.skip_page ;
    };
    let fetch_data = await DAO.getDataUser(Model,query,{__v : 0},{lean : true},number) ;
    let fetch_all_data = await DAO.getData(Model,query,{ __v : 0 }, {lean : true}) ;
    return {
      Count : fetch_all_data.length ,
      fetch_data 
    };
  }catch(err){
    throw err ;
  };
};

const add_edit_delete_vouchers = async(payloadData) =>{
  try{
    let Model = Models.vouchers  ;
    let data= {} ; 
    if(payloadData.name){ data.name = payloadData.name  };
    if(payloadData.image){ data.image = payloadData.image  };
    if(payloadData.ammount){ data.ammount = payloadData.ammount  };
    
    if(payloadData._id){
      let condition= {_id : payloadData._id ,is_deleted : false } ;
      if(payloadData.is_deleted == true || payloadData.is_deleted == false){
        data.is_deleted = payloadData.is_deleted 
      };
      let update_or_delete_data = await DAO.findAndUpdate(Model,condition,data,{ new : true }) ;
      return update_or_delete_data ;
    }else{
      let save_data = await DAO.saveData(Model,data) ;
      return save_data ;
    }
  }catch(err){
    throw err ;
  }
};

const list_vouchers = async(payloadData) =>{
  try{
    let Model = Models.vouchers  ;
    let query = { is_deleted : false } ;
    if(payloadData._id){
      query = {  _id : payloadData._id , is_deleted : false  };
    }; 
    let number = 0 ;
    if(payloadData.skip_page){
      number = payloadData.skip_page ;
    };
    let fetch_data = await DAO.getDataUser(Model,query,{__v : 0},{lean : true},number) ;
    let fetch_all_data = await DAO.getData(Model,query,{ __v : 0 }, {lean : true}) ;
    return {
      Count : fetch_all_data.length ,
      fetch_data 
    };
  }catch(err){
    throw err ;
  };
};

const queries_listing = async(payloadData) =>{
      try{
    
           let query = {is_deleted : false}
           let number = 0 ;
           if(payloadData.skip_page){
               number = payloadData.skip_page 
           };
           let projection = { __v : 0}
           let option = {lean : true ,skip : number,limit : 10}
           let fetch_data = await DAO.get_data(Models.queires,query,projection,option)
           let fetch_all_count = await DAO.count(Models.queires,query) ;
            return {
                  Count : fetch_all_count,
                  fetch_data 
            };
      }catch(err){
        throw err ;
      }
    }


module.exports = {
  imageUpload : imageUpload,
  adminLogin : adminLogin,
  add_edit_departments : add_edit_departments,
  delete_departments : delete_departments ,
  list_departments : list_departments,
  add_edit_plans : add_edit_plans,
  list_plans : list_plans,
  user_listing : user_listing,
  delete_block_users : delete_block_users,
  add_edit_status : add_edit_status,
  list_status : list_status,
  delete_status : delete_status,
  add_edit_tutorial_screens : add_edit_tutorial_screens,
  list_tutorial_screens : list_tutorial_screens,
  delete_tutorial_screen : delete_tutorial_screen,
  add_edit_about_us  : add_edit_about_us,
  list_about_us : list_about_us,
  add_edit_policies : add_edit_policies,
  list_policies: list_policies,
  add_edit_terms : add_edit_terms,
  list_terms  : list_terms,
  add_edit_delete_hastags : add_edit_delete_hastags,
  list_hashtags : list_hashtags,
  add_edit_delete_vouchers : add_edit_delete_vouchers,
  list_vouchers : list_vouchers,
  queries_listing : queries_listing
};

