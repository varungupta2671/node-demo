const DAO = require("../DAOManager").queries;
const Models = require("../Models");
const TokenManager = require("../Libs/tokenManager");
const  commonController = require("../Controller/commonController");
var moment = require('moment');
const mongoose = require("mongoose");

const match_data_group = async (channel_id) => {
  try {
    let match = {
      $match: {
        channel_id : mongoose.Types.ObjectId(channel_id) ,  
        is_deleted : false
      }
    }
    return match;
  }catch (err) {
    throw err;
  }
};

const match_data = async (payload_data) => {
  try {
    let match = {
      $match: { 
        is_deleted : false,
        ...payload_data
      }
    }
    return match;
  }catch (err) {
    throw err;
  }
};

const unwind_status_read = async () => {
  try {
    let unwind = { $unwind: { path: "$status_data", preserveNullAndEmptyArrays: true } }
    return unwind;
  }
  catch (err) {
      throw err;
  }
}

const match_status = async (user_id) => {
  try {
    let match = {
      $match: {
        $and : [
          {"status_data.user_id" : mongoose.Types.ObjectId(user_id)},
          {"status_data.is_deleted" : false},
        ]
       
      }
    }
    return match;
  }
  catch (err) {
    throw err;
  }
}


const lookup_user_data = async(user_id) => {
  try{
      let lookup = {
          $lookup:
              {
                  from: "users",
                  let: { is_deleted : false },
                  pipeline: [
                      { $match:
                          { $expr:
                              { $and:
                                  [
                                      { $eq : ["$_id" , mongoose.Types.ObjectId(user_id) ] },
                                      { $eq: [ "$isDeleted", false ] }
                                    
                                  ]
                              }
                          }
                    },
                  ],
                  as: "user_data"
              }
          }
      return lookup ;
  }catch(err){
      throw err ;
  }
};

const unwind_user_data = async() =>
{
  try{
      let unwind = {
          $unwind  : 
          {
              path  : "$user_data",
              preserveNullAndEmptyArrays : true
          }
      }
      return unwind ;
  }catch(err){
      throw err ;
  }
};

const lookup_saved_message = async() => {
  try{
      let lookup = {
          $lookup:
              {
                  from: "saved_items",
                  let: { chat_id: "$_id" ,userId_data : "$user_data._id"},
                  pipeline: [
                      { $match:
                          { $expr:
                              { $and:
                                  [
                                      { $eq : ["$user_id" ,"$$userId_data"] },
                                      { $eq : [ "$message_id" ,"$$chat_id" ]},
                                      { $eq: [ "$is_saved", true ] }
                                    
                                  ]
                              }
                          }
                    },
                  ],
                  as: "save_message"
              }
          }
      return lookup ;
  }catch(err){
      throw err ;
  }
};

const unwind_saved_message = async() =>
{
  try{
      let unwind = {
          $unwind  : 
          {
              path  : "$save_message",
              preserveNullAndEmptyArrays : true
          }
      }
      return unwind ;
  }catch(err){
      throw err ;
  }
};


const gorup_data = async () => {
  try {
    let group = {
      $group: {
        "_id" : "$_id",
        "sender_id" : {$first :"$sender_id" },
        "reciever_id" : {$first :"$reciever_id" },
        "channel_id" : {$first :"$channel_id" },
        "message" : {$first :"$message" },
        "status_data" : { $first : "$status_data" },
        "reaction": {$first : "$reaction" },
        "reply" : {$first : "$reply"} ,
        "total_reply_count" :{$first : "$total_reply_count"},
        "message_type": { $first : "$message_type" },
        "date" :{$first : "$date"},
        "time" :{$first : "$time"},
        "save_message_data" : {$first : "$save_message"}

      }
    }
    return group;
  }
  catch (err) {
    throw err;
  }
};

const project_data = async () => {
  try {
    let project_data = {
      $project: {
        "_id" : 1,
        "sender_id" :1,
        "reciever_id" : 1,
        "channel_id" : 1,
        "message" : 1,
        "status_data" : 1,
        "reaction": 1,
        "reply" : 1,
        "total_reply_count" :1,
        "message_type": 1,
        "date" :1,
        "time" :1,
        "save_message" : {
          $cond : {
                if : { $eq : [ "$save_message_data" , null ] },
                then : false,
                else : true
             }
    }

      }
    }
    return project_data;
  }
  catch (err) {
    throw err;
  }
};

const sort_data = async () => {
  try {
    let sort = {
      $sort: {
        time : 1      
      }
    }
    return sort;
  }catch (err) {
    throw err;
  }
};


const list_message_groups = async (groupId,myId) => {
  try {


    let matchData = await match_data_group(groupId);
    let unwindChat =  await unwind_status_read();
    let matchStatus = await match_status(myId);
    let lookUp_user = await lookup_user_data(myId);
    let unwind_user = await unwind_user_data();
    let lookup_message = await lookup_saved_message();
    let unwind_message = await unwind_saved_message();
    let group = await gorup_data();
    let project = await project_data();
    let sort = await sort_data()

    let query = [
      matchData,
      unwindChat,
      matchStatus,
      lookUp_user,
      unwind_user,
      lookup_message,
      unwind_message,
      group,
      project,
      sort
    ];
    let populate = [
      {
        path: "sender_id",
        select: "_id full_name iso2_code contact_number country_code profile_picture email"
      },
      {
        path: "reciever_id",
        select: "_id full_name iso2_code contact_number country_code profile_picture email"
      },
      {
        path: "channel_id",
        select: "_id channel_name image description"
      },
      {
        path : "reply.user_id",
        select: "_id full_name iso2_code contact_number country_code profile_picture email"
      }

    ]
    let option = {lean : true }
    let fetch_data = await DAO.aggregateDataWithPopulate(Models.chats,query,populate,option);
    return fetch_data;
  }catch (err) {
    throw err;
  };
};

const list_message_reciver = async (payload_data,myId) => {
  try {


    let matchData = await match_data(payload_data);
    let lookUp_user = await lookup_user_data(myId);
    let unwind_user = await unwind_user_data();
    let lookup_message = await lookup_saved_message();
    let unwind_message = await unwind_saved_message();
    let group = await gorup_data();
    let project = await project_data();
    let sort = await sort_data()

    let query = [
      matchData,
      lookUp_user,
      unwind_user,
      lookup_message,
      unwind_message,
      group,
      project,
      sort
    ];
    let populate = [
      {
        path : " reciever_id ",
        select:" _id full_name profile_picture isAvailable"
      },
      {
        path : "sender_id" ,
        select  : "_id full_name profile_picture isAvailable"
      },
      {
        path: "channel_id",
        select: "_id channel_name image description"
      },

    ]
    let option = {lean : true }
    let fetch_data = await DAO.aggregateDataWithPopulate(Models.chats,query,populate,option);
    return fetch_data;
  }catch (err) {
    throw err;
  };
};


module.exports =  {
  list_message_groups : list_message_groups,
  list_message_reciver : list_message_reciver
}



