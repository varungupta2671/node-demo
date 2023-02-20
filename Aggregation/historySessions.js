
const DAO = require("../DAOManager").queries;
const Models = require("../Models");
const TokenManager = require("../Libs/tokenManager");
const commonController = require("../Controller/commonController");
const moment = require('moment');

const match_booking = async (userId) => {
    try {
        let match = {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                $or :[
                    { $or: [{ status: "Pending" }, { status: "Confirmed" }]},
                 ],
                 $and:[ 
                    {status : {$ne : "Canceled" }},
                    {status : {$ne : "Compeleted"}}
                ], 
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

const match_booking_1 = async (userId) => {
    try {
        let match = {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                status: "Compeleted",  
                $and:[ 
                    {status : {$ne : "Canceled" }},
                    {status : {$ne : "Pending"}}
                ], 
                status : {$ne : "Confirmed"}, 
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


const lookup_user_1 = async (userId) => {
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
                    { $project: { _id: 1 } }
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

const unwind_user_1 = async () => {
    try {

        let unwind = { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } }
        return unwind;
    }
    catch (err) {
        throw err;
    }
}

const lookup_order_rating = async () => {
    try {

        let lookup = {
            $lookup:
            {
                from: "orderratings",
                let : { id : "$_id", user : "$userData._id" },
                pipeline: [
                    { $match:
                       { $expr:
                          { $and:
                             [
                              {$eq :[ "$orderId" , "$$id"] }, 
                              {$eq :[ "$userId" , "$$user"] }
                             ]
                          }
                       }
                    },
                    { $project: {  __v : 0 } }
                 ],
                as: "rating"
            }
        }
        return lookup;
    }
    catch (err) {
        throw err;
    }
}

const unwind_order_rating = async () => {
    try {

        let unwind_vendor = { $unwind:{ path: "$rating", preserveNullAndEmptyArrays: true } }
        return unwind_vendor;
    }
    catch (err) {
        throw err;
    }
}

const group_sub_category_product = async () => {
    try {

        let group = {
            $group: {
                "_id": "$_id",
                "userId": { $first: "$userId" },
                "studioId": { $first: "$studioId" },
                "sessionId": { $first: "$sessionId" },
                "planId": { $first: "$planId" },
                "date": { $first: "$date" },
                "status": { $first: "$status" },
                "bookingId" :{$first :"$booking_id"},
            }
        }
        return group;
    }
    catch (err) {
        throw err;
    }
}
const group_sub_category_product_1 = async () => {
    try {

        let group = {
            $group: {
                    "_id": "$_id",
                    "userId": { $first: "$userId" },
                    "studioId": { $first: "$studioId" },
                    "sessionId": { $first: "$sessionId" },
                    "planId": { $first: "$planId" },
                    "date": { $first: "$date" },
                    "status": { $first: "$status" },
                    "ratings": { $first: "$rating.rating" },
                    "message": {$first : "$rating.message"},
                    "bookingId" :{$first :"$booking_id"},
            }
        }
        return group;
    }
    catch (err) {
        throw err;
    }
}

const project_data_1 = async () => {
    try {

        let project = {
            $project: {
                    _id : 1,
                    userId : 1,
                    studioId : 1,
                    sessionId : 1,
                    planId : 1,
                    date : 1,
                    status : 1,
                    bookingId : 1,
            }
        }
        return project;
    }
    catch (err) {
        throw err;
    }
}


const project_data = async () => {
    try {

        let project = {
            $project: {
                    _id : 1,
                    userId : 1,
                    studioId : 1,
                    sessionId : 1,
                    planId : 1,
                    date : 1,
                    status : 1,
                    bookingId : 1,
                    ratings : 1,
                    message : 1,
               
            }
        }
        return project;
    }
    catch (err) {
        throw err;
    }
}

const sort = async () => {
    try {
        let sort = {
            $sort: {
                date: -1
            }
        }
        return sort;
    }
    catch (err) {
        throw err;
    }
}

const project_data_2 = async (last, ongoing) => {
    try {
        let data1 = [];
        if (ongoing.length != 0) {
            data1 = ongoing;
        }

        let data = [];
        if (last.length != 0) {
            data = last;
        }

        let project = {
            Ongoing: data1,
            Past: data
        }
        return project;
    }
    catch (err) {
        throw err;
    }
}

const list_order_1 = async (userId) => {
    try {
        let match = await match_booking(userId);
        let group = await group_sub_category_product_1();
        let project = await project_data_1();
        let sortData = await sort();
        let query = [
            match,
            group,
            project,
            sortData
        ];
        let populate =[
            {
                path: "userId",
                select: "_id name userName profilePicture",
             },
             {
                path: "studioId",
                select: "_id name image shortDiscription",
             },
             {
                path: "sessionId",
                select: "_id name image date startTime durationTime discription createdAt ",
             },
             {
                path: "planId",
                select: "_id name numberOfClasses price currency",
             }

        ]
        let option = {lean : true}

        let data = await DAO.aggregateDataWithPopulate(Models.bookSessions, query,populate,option);

        if(data.length != 0 ){
            
            let date  = new Date(new Date().setHours(0,0,0,0)).getTime();
            
            let current_time = moment().add(5, 'h').add(30, 'm').format("HH:mm")

           let startTime =  current_time
           //###--------get mintues from time
           let tempTime1 = moment.duration(startTime);
           let minutes =  tempTime1.minutes();

           //###--------get hours from time and convert in minutes
           let tempTime = moment.duration(startTime);
           let hours1 =  tempTime.hours();
           let hours = hours1 * 60;
           console.log( "time..data", )
           
           let time  = minutes + hours
           console.log(time)
            for (let xdata of data) {
                console.log( "dates............",xdata.sessionId.date ,"   ", date)
                if(xdata.sessionId.date < date){
                    
                    let update_status =  await commonController.update_session_status(xdata._id);
                               
                }
                if(xdata.sessionId.date == date){
                    console.log("current time ",time)
                   if(xdata.sessionId.startTime < time ){

                    
                       let update_status =  await commonController.update_session_status(xdata._id); 
                   } 
                }
            
        }
    }
    return data;
    }
    catch (err) {
        throw err;
    }
}

const list_order = async (userId) => {
    try {
        let ongoing = await list_order_1(userId);
        let last = await list_order_2(userId);
        let project = await project_data_2(last, ongoing);

        return project;
    }
    catch (err) {
        throw err;
    }
}



const list_order_2 = async (userId, language) => {
    try {
        let match = await match_booking_1(userId);
        let lookUpRating = await lookup_order_rating();
        let unwindRating = await unwind_order_rating();
        let lookUpUser = await lookup_user_1(userId);
        let unwindUser = await unwind_user_1() 
        let group = await group_sub_category_product_1();
        let project = await project_data();
        let sortData = await sort();
        let query = [
            match,
            lookUpUser,
            unwindUser,
            lookUpRating,
            unwindRating,
            group,
            project,
            sortData
        ];
        let populate =[
            {
                path: "userId",
                select: "_id name userName profilePicture",
             },
             {
                path: "studioId",
                select: "_id name image shortDiscription",
             },
             {
                path: "sessionId",
                select: "_id name image date startTime durationTime discription createdAt ",
             },
             {
                path: "planId",
                select: "_id name numberOfClasses price currency",
             }

        ]
        let option = {lean : true}

        let data = await DAO.aggregateDataWithPopulate(Models.bookSessions, query,populate,option);

        return data;
    }
    catch (err) {
        throw err;
    }
}


module.exports = {
    list_order_1: list_order_1,
    list_order_2: list_order_2,
    list_order: list_order,
    project_data: project_data,
    group_sub_category_product: group_sub_category_product,
    group_sub_category_product_1: group_sub_category_product_1,
   
}