const DAO = require("../DAOManager").queries,
  Config = require("../Config"),
  TokenManager = require("../Libs/tokenManager"),
  NotificationsManager = require("../Libs/NotificationsManager"),
  ERROR = Config.responseMessages.ERROR,
  Models = require("../Models"),
  bcrypt = require("bcryptjs"),
  UploadMultipart = require("../Libs/UploadMultipart"),
  commonController = require("./commonController"),
  aws = require('../Config/awsS3Config'),
  AWS = require("aws-sdk"),
  fs = require('fs'),
  moment = require('moment'),
  randomstring = require("randomstring"),
  UniversalFunctions = require("../Utils/UniversalFunctions");
  winston = require("winston");

const filter_prices = async(start_price , end_price ) => {
          try {
              console.log('start_price ',start_price  ) ;
              console.log(' end_price', end_price ) ;
              
            let price_filter = {
                // $or : [
                    // {
                    //     $and : [
                    //         { $eq : [ start_price, null ] },
                    //         { $eq : [ end_price, null ] },
                    //     ]
                    // },
                    // // {
                    //      { $gte : ["$price",start_price]},
                    //     {$lte : ["$price","end_price"]}
                        $and :[
                            { $gte : ["$price" , start_price]},
                            {$lte : ["$price" , end_price]}
                        ]
                    // }
                // ]     
            }
                // let apply_filter = {
                //       $or : [
                //             {
                //                   $and : [
                //                      { $eq : [ min_weight, null ] },
                //                      { $eq : [ max_weight, null ] },
                //                   ]
                //             },
                //             {
                //                $and : [
                //                   { $gte : [ "$weight", min_weight ] },
                //                   { $lte : [ "$weight", max_weight ] }
                //                ]
                //         }
                //       ]
                // }
    
                return price_filter ;
    
          }
          catch(err) {
                throw err;
          }
}

// const filter_prices = async(start_price,end_price) => {
//     try{
//         let price_filter = {
//             $or : [
//                 {
//                     $and : [
//                         {price : { $eq : [ start_price, null ] }},
//                         {price : { $eq : [ end_price, null ] }},
//                     ]
//                 },
//                 {
//                     $and  : [
//                         { $gte : [ "$price", start_price ]},
//                         { $lte : [ "$price", end_price ]}
//                     ]
//                 }
//             ]     
//         }
//        return price_filter ;
//     }catch(err){
//         throw err ;
//     }
// }
const payment_filter = async(paymentType) => 
{
    try{
        let filter_payment = {
            $or : [
                { paymentType: { $eq : [ paymentType, null ] }},
                {
                    paymentType : {$regex : paymentType, $options :"i"}
                }
            ]
        }
        return  filter_payment ;
    }catch(err){
        throw err ;
    }

}
const filter_followers = async(start_follower,end_follower) => {
    try{
        let follower_filter = {
            $or : [
                {
                    $and : [
                        {start_follower :{ $eq : [ start_follower, null ] }},
                        { end_follower : {$eq : [ end_follower, null ]} },
                    ]
                },
                {
                    $and  : [
                        { start_follower : {$gte : start_follower }},
                        { end_follower : {$lte : end_follower }}
                    ]
                }
            ]  
        }
        return follower_filter ;
    }catch(err){
        throw err ;
    }
}
const filter_engagement = async(engage_start,engage_end) => {
    try{
        let engagemnet_filter = {
            $or : [
                {
                    $and : [
                        { engagement_rate_start : {$eq : [ engage_start, null ] }},
                        { engagement_rate_end : {$eq : [ engage_end, null ] }},
                    ]
                },
                {
                    $and  : [
                        { engagement_rate_start : {$gte : engage_start }},
                        { engagement_rate_end : {$lte : engage_end }}
                    ]
                }
            ]  
        }
        return engagemnet_filter;
    }catch(err){
        throw err ;
    }
}
const serach_gender = async(gender) => {
    try{
        let gender_search  = {
            $or : [
                { gender: {$eq : [ gender, null ] }},
                {
                    gender : {$regex : gender, $options :"i"}
                }
            ]
        }
        return gender_search ;
    }catch(err){
        throw err ;
    }
}
const search_country = async(country) => {
    try{
        let country_search  = {
            $or :[
                { country: { $eq : [country,null] }},
                { country : {$regex : country ,$options : "i"}}
            ]
        }
        return country_search ;
    }catch(err){
        throw err ;
    }
}
const search_city = async(city) =>
{
    try
    {
        let city_search = {
            $or : [
                {city : { $eq : [city , null]}},
                {city : {$regex : city ,$options : "i"}}
            ]
        }
        return city_search ;
    }catch(err){
        throw err ;
    }
}
const filter_language = async(language) => 
{
    try
    {
        let language_filter = {
            languages  : {$in :language},
            isDeleted : false
        }
        return language_filter ;
    }catch(err)
    {
        throw err ;
    }
}
const filter_category = async(category) => {
    try{
        let filter_category = {
            category  : {$in : category},
            isDeleted : false
        }
        return filter_category ;
    }catch(err)
    { 
        throw err ;
    }
}
const redact_data = async(filters) => {
      try {
          console.log('filters',filters);
            let redact = {
                    $redact : {
                        $cond : {
                            if : { 
                                $and : [
                                    await filter_prices(filters.start_price, filters.end_price),
                                    await filter_followers(filters.start_follower, filters.end_follower),
                                    // await filter_engagement(filters.engage_start, filters.engage_end),
                                    // await serach_gender(filters.gender),
                                    // await payment_filter(filters.paymentType),
                                    // await search_country(filters.country),
                                    // await search_city(filters.city),
                                    // await filter_language(filters.language),
                                    // await filter_category(filters.category)
                                ] 
                           },
                           then : "$$KEEP",
                           else : "$$PRUNE"
                        }
                    }
            }
                
            return redact ;
        }
      catch(err) {
            throw err;
      }
}
const filter_data = async() => {
    try {

          let set_data = {
                $set : {
                      filter_data : {
                            $filter : {
                                  input : "$lookup_test_details",
                                  as : "data",
                                  cond : { $eq: [ "$$data.category_id", "$_id" ] }
                            }
                      },
                      // seen_videos : {
                      //       $cond : {
                      //             if : { 
                      //                   $in : [ "$fetch_videos._id", video_ids ] 
                      //             }, 
                      //             then : true, 
                      //             else : false
                      //       }
                      // }
                }
          }

          return set_data

    }
    catch(err) {
          throw err;
    }
}
module.exports = {
    filter_prices : filter_prices,
    filter_followers : filter_followers,
    filter_engagement : filter_engagement,
    serach_gender : serach_gender,
    search_country : search_country,
    search_city : search_city,
    payment_filter : payment_filter,
    filter_language : filter_language,
    filter_category : filter_category ,
    redact_data : redact_data,
  


}