const DAO = require("../DAOManager").queries;
const Models = require("../Models");
const TokenManager = require("../Libs/tokenManager"),
moment = require('moment');

const match_session = async (studioId,date) => {
    try {
        let cuurent_date = new Date(date).getTime();
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
        let match = {
            $match: {
                studioId: mongoose.Types.ObjectId(studioId),
                date : cuurent_date,
                startTime: { $gt: time},
                isDeleted: false,
                isBlocked: false,
            }
        }
        return match;
    }
    catch (err) {
        throw err;
    }
}

const lookup_plans = async () => {
    try {
        let lookup = {
            $lookup:
               {
                 from: "plans",
                 let: { studioId : "$studioId", plan: "$planId" },
                 pipeline: [
                    { $match:
                       { $expr:
                          { $in:
                             [ "$_id",  "$$plan" ]
                          }
                       }
                    },
                    { $match:
                        { $expr:
                            { $eq: [ "$studioId", "$$studioId" ] }
                        }
                     },
                    { $project: { __v : 0 } }
                 ],
                 as: "plan"
               }
          }
        return lookup;
    }
    catch (err) {
        throw err;
    }
}


const unwind_plans = async () => {
    try {
        let unwind = { $unwind: "$plan" }
        return unwind;
    }
    catch (err) {
        throw err;
    }
}


const group_session = async () => {
    try {
        let group = {
            $group: {
                "_id": "$_id",
                "studioId": { $first: "$studioId" },
                "name": { $first: "$name" },
                "image": { $first: "$image" },
                "date": { $first: "$date" },
                "startTime": { $first: "$startTime" },
                "durationTime": { $first: "$durationTime" },
                "discription": { $first: "$discription" },
                "plans": {
                    $addToSet: {
                        "_id": "$plan._id",
                        "name": "$plan.name",
                        "numberOfClasses": "$plan.numberOfClasses",
                        "price" : "$plan.price",
                        "currency" : "$plan.currency", 
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


const project_session = async () => {
    try {
        let project = {
            $project: {
                _id : 1,
                studioId:1,
                name: 1,
                image:1 ,
                date:1 ,
                startTime: 1,
                durationTime:1,
                discription: 1,
                plans: 1,

            }
        }
        return project;
    }
    catch (err) {
        throw err;
    }
}

const list_sessions = async (studioId,date) => {
    try {
        let match = await match_session(studioId,date);
        let lookupPlans = await lookup_plans();
        let unwindPlans = await unwind_plans();
        let group = await group_session();
        let project = await project_session();
        let query = [
            match,
            lookupPlans,
            unwindPlans,
            group,
            project

        ];
        let populate = [
            {
                path: "studioId",
                select: "_id name image",
            }
        ]
        let option = { lean: true }
        let fetch_data = await DAO.aggregateDataWithPopulate(Models.cloneSessions, query, populate, option);

        return fetch_data;
    }
    catch (err) {
        throw err;
    }
}


module.exports = {
    list_sessions: list_sessions,
    group_session: group_session,

}