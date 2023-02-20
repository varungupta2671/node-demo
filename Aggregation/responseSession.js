
const DAO = require("../DAOManager").queries;
const Models = require("../Models");
const TokenManager = require("../Libs/tokenManager");
const  commonController = require("../Controller/commonController");

const match_session_id = async (sessionId) => {
      try {
            let match = {
                  $match: {
                        _id : mongoose.Types.ObjectId(sessionId) ,
                        isDeleted: false,
                        isBlocked: false
                  }
            }
            return match;
      }
      catch (err) {
            throw err;
      }
}

const lookup_users_1 = async (userId) => {
      try {

            let lookup ={
                  $lookup:
                  {
                      from: "users",
                      pipeline: [
                          {
                              $match:
                                  {
                                    $and:
                                        [
                                       
                                              { _id: mongoose.Types.ObjectId(userId)},
          
                                        ]
                                  }
                          },
                          { $project: { _id : 1 } }
                      ],
                      as: "userData"
                  }
              }  
              return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_users_1 = async () => {
      try {

            let unwind = { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}

const lookup_session_group = async () => {
      try {

            let lookup ={
                  $lookup:
                  {
                        from: "sessiongroups",
                        let: { id: "$_id" , userid : "$userData._id"},
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                          {
                                                $and:
                                                      [
                                                                 { $eq: ["$sessionId", "$$id"] },
                                                                 { $eq: ["$userId", "$$userid"] },
                                                      ]
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "groups"
                  }
            }
            return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_session = async () => {
      try {

            let unwind = { $unwind: { path: "$groups", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}

const lookup_session_my_group = async () => {
      try {

            let lookup ={
                  $lookup:
                  {
                        from: "sessiongroups",
                        let: { id: "$_id", number : "$groups.groupNo" },
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                          {
                                                $and:
                                                      [
                                                                 { $eq: ["$sessionId", "$$id"] },
                                                                 { $eq: ["$groupNo", "$$number"] },
                                                      ]
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "groupData"
                  }
            }
            return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_my_group = async () => {
      try {

            let unwind = { $unwind: { path: "$groupData", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}


const lookup_link_deatils = async () => {
      try {
            let lookup ={
                  $lookup:
                  {
                        from: "linksdetails",
                        let: { id: "$groupData._id", number : "$groups.groupNo",user : "$userData._id"},
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                           { 
                                                      $and : [
                                                                 { $eq : ["$linkId", "$$id"] },
                                                                 { $eq : ["$groupNo", "$$number"] }    
                                                         ] 
                                                    
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "linkDeatils"
                  }
            }
            return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_links_details = async () => {
      try {

            let unwind = { $unwind: { path: "$linkDeatils", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}

const unwind_links_data = async () => {
      try {

            let unwind = { $unwind: { path: "$linkDeatils.myId", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}

const match_data_id = async (userId) => {
      try {
            let match = {
                  $match: {
                        "linkDeatils.myId.userId" : mongoose.Types.ObjectId(userId) ,
                  }
            }
            return match;
      }
      catch (err) {
            throw err;
      }
}

const lookup_single_user = async () => {
      try {

            let lookup ={
                  $lookup:
                  {
                        from: "uploadlinks",
                        let: { id: "$_id" , userid : "$userData._id" },
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                          {
                                                $and:
                                                     [
                                                                 { $eq: ["$sessionId", "$$id"] },
                                                                 { $eq: ["$userId", "$$userid"] },
                                                      ] 
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "singleData"
                  }
            } 
            return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_user_single = async () => {
      try {

            let unwind = { $unwind: { path: "$singleData", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}


const lookup_likes = async () => {
      try {

            let lookup ={
                  $lookup:
                  {
                        from: "likelinks",
                        let: { data: "$groupData._id" , user : "$userData._id" },
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                          {
                                                $and:
                                                      [
                                                                 { $eq: ["$groupLiknkId", "$$data"] }
                                                      ]
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "likesData"
                  }
            }
            return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_user_likes = async () => {
      try {

            let unwind = { $unwind: { path: "$likesData", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}

const lookup_comments = async () => {
      try {

            let lookup ={
                  $lookup:
                  {
                        from: "reportlinks",
                        let: { id: "$groupData._id" , user : "$userData._id" },
                        pipeline: [
                              {
                                    $match:
                                    {
                                          $expr:
                                          {
                                                $and:
                                                      [
                                                                 { $eq: ["$groupLiknkId", "$$id"] }
                                                      ]
                                          }
                                    }
                              },
                              { $project: { __v : 0 } }
                        ],
                        as: "reportData"
                  }
               }
               return lookup;
      }
      catch (err) {
            throw err;
      }
}

const unwind_user_comments = async () => {
      try {

            let unwind = { $unwind: { path: "$reportData", preserveNullAndEmptyArrays: true } }
            return unwind;
      }
      catch (err) {
            throw err;
      }
}




const group_pods = async () => {
      try {
            let group = {
                  $group: {
                        "_id": "$_id",
                        "name":{ $first: "$name" },
                        "title":{ $first: "$title" },
                        "date" :{ $first: "$date" },
                        "startTime" :{ $first: "$startTime" },
                        "durationTime":{ $first: "$durationTime" },
                        "uploadTime":{ $first: "$uploadTime" },
                        "engageStartTime":{ $first: "$engageStartTime" },
                        "activityTime":{ $first: "$activityTime" },
                        "discription":{ $first: "$discription" },
                        "singleData":{$first:"$singleData"},
                        "group": {
                              $addToSet: {
                                    "_id": "$groupData._id",
                                    "groupNo" : "$groupData.groupNo",
                                    "userId": "$groupData.userId",
                                    "sessionId": "$groupData.sessionId",
                                    "linkUrl": "$groupData.linkUrl",
                                    "isOpen": "$linkDeatils.isOpen",
                                    "createdAt" : "$linkDeatils.createdAt",
                                    "likes" : "$likesData",
                                    "reports" :"$reportData"
                              }
                        }
                  }
            }
            return group;
      }
      catch (err) {
            throw err;
      }
}


const project_pods = async () => {
      try {
                let project = {
                          $project: {
                                    _id: 1,
                                    name: 1,
                                    title: 1,
                                    date: 1,
                                    startTime: 1,
                                    durationTime: 1,
                                    uploadTime: 1,
                                    engageStartTime:1,
                                    discription :1,
                                    group:{
                                          $cond: { if: { $eq: ["$group", [{ }]] }, then:"$singleData" , else: "$group"}
                                    }
                          }
                }
                return project;
      }
      catch (err) {
                throw err;
      }
}


const group_sessions = async (sessionId,userId) => {
      try {
            let match = await match_session_id(sessionId);
            let lookupUser1 = await lookup_users_1(userId);
            let unwindUser1 = await unwind_users_1();
            let lookUpSession = await lookup_session_group();
            let unwindSession = await unwind_session();
            let lookUpMySession = await lookup_session_my_group();
            let unwindMySession = await unwind_my_group();
            let lookUpLinkDeatils = await lookup_link_deatils();
             let unwindLinkDeatils = await unwind_links_details();
            let lookUpSingle = await lookup_single_user();
            let unwindSingle = await unwind_user_single();
            let lookUpLikes = await lookup_likes();
            let unwindLikes = await unwind_user_likes();
            let lookUpComments = await lookup_comments();
            let unwindComments = await unwind_user_comments();
            let group = await group_pods();
            let project = await project_pods();


            let query = [
                  match,
                  lookupUser1,
                  unwindUser1,
                  lookUpSession,
                  unwindSession,
                  lookUpMySession,
                  unwindMySession,
                  lookUpLinkDeatils,
                  unwindLinkDeatils,
                  lookUpSingle,
                  unwindSingle,
                  lookUpLikes,
                  unwindLikes,
                  lookUpComments,
                  unwindComments,
                  group,
                  project

            ];
            let fetch_data = await DAO.aggregateData(Models.cloneSessions, query);
            if(fetch_data.length != 0){
                 for(let data of fetch_data){
                     
                     let groupsData = data.group
                     if(groupsData){
                        groupsData.sort((a, b) => b.createdAt - a.createdAt)
                        for(let group of groupsData){

                              let likesData = group.likes
                              let reports = group.reports
                              let isOpen = group.isOpen
                              console.log("likes",likesData," reports ",reports ,)
                              if(likesData){
                                    group.isLiked = true  
                              }
                              else{
                                    group.isLiked = false 
                              }
                              if(reports){
                                    group.isReport = true
                              }
                              else{
                                    group.isReport = false 
                              }
                              if(isOpen.length != 0){
                                    for(let i = 0 ;i<isOpen.length; i++){
                                          let match_userId = await commonController.check_userId(isOpen[i],userId)
                                          if(match_userId.length != 0 ){
                                                group.isOpen = true 
                                          }
                                          else{
                                                group.isOpen = false  
                                          }
                                    }      
                              }
                              else{
                                    group.isOpen = false 
                              }
                        }
                     }
                 }
            }
            return fetch_data;
      }
      catch (err) {
            throw err;
      }
}

module.exports = {
      group_sessions: group_sessions,
      group_pods: group_pods,
}