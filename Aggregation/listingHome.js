const DAO = require("../DAOManager").queries;
const Models = require("../Models");
const TokenManager = require("../Libs/tokenManager");
const  commonController = require("../Controller/commonController");
var moment = require('moment');

const match_id = async(payloadData,userData) =>{
      try{
            let match = {
                  $match : {
                  
                        _id : {$nin  : [mongoose.Types.ObjectId(payloadData._id)]},
                        $and: [
                              {isProfileCompleted : true},
                              {expertiseUpdated: true },
                              {addressUpdated: true},
                              {aboutUpdated :  true} ,
                              {educationUpdated : true } ,
                              {tagsUpdated : true },
                        ],
                        // _id : mongoose.Types.objectId(_id),
                        isExpert : true,
                        isDeleted  : false,
                        isBlocked :  false
                  }
            };



            if(payloadData.expert_id){
                  match = {
                        $match : {
                        
                              _id : mongoose.Types.ObjectId(payloadData.expert_id)
                        }
                  };
            }

            if(payloadData.expertIndustry)
            {
                  console.log("payloadData.expertIndustry is here",payloadData.expertIndustry);
                  match = {
                  $match : {
                        _id : { $nin  : [mongoose.Types.ObjectId(payloadData._id)]},
                        $and: [
                              {isProfileCompleted : true},
                              {expertiseUpdated: true },
                              {addressUpdated: true},
                              {aboutUpdated :  true} ,
                              {educationUpdated : true } ,
                              {tagsUpdated : true },
                        ],
                        expertIndustry :   mongoose.Types.ObjectId(payloadData.expertIndustry) ,
                        isExpert : true,
                        isDeleted  : false,
                        isBlocked :  false
                  }
                  } ;
            };



            return match ; 
      }catch(err){
            throw err;
      }
} ;

const lookup_categies = async() => {
    try{
        let lookup ={
            $lookup:
               {
                 from: "categories",
                 let: { userId: "$_id"},
                 pipeline: [
                    { $match:
                       { $expr:
                          { $and:
                             [
                               { $eq: [ "$userId",  "$$userId" ] },
                               { $eq: [ "$isDeleted", false ] }
                             ]
                          }
                       }
                    },
                    { $project: { __v :0 } }
                 ],
                 as: "categories_details"
               }
          }
        return lookup ;
    }catch(err){
        throw err ;
    }
} ;
const lookup_media = async() => {
    try{
        let lookup = {
            $lookup:
                {
                    from: "medias",
                    let: { userId: "$_id",  categoryId : "$categories_details._id" },
                    pipeline: [
                        { $match:
                            { $expr:
                                { $and:
                                    [
                                        { $eq: [ "$userId",  "$$userId" ] },
                                        { $eq : [ "$categoryId" , "$$categoryId"] },
                                        { $eq: [ "$isDeleted", false ] }
                                      
                                    ]
                                }
                            }
                        },
                        { $project: { __v :0 ,
                            isDeleted : 0,
                            isBlocked  :0,
                            createdAt : 0,
                            updatedAt : 0
                        } }
                    ],
                    as: "media_details"
                }
            }
            // $lookup : {
            //     from : "medias",
            //     localField : "_id",
            //     foreignField : "userId",
            //     as : "media_details"
            // }
        // };
        return lookup ;
    }catch(err){
        throw err ;
    }
} ;
const unwind_category = async() =>
{
    try{
        let unwind = {
            $unwind  : 
            {
                path  : "$categories_details",
                preserveNullAndEmptyArrays : true
            }
        }
        return unwind ;
    }catch(err){
        throw err ;
    }
};

const unwind_media = async() => {
    try{
        let unwind = {
            $unwind : {
                path  : "$media_details",
                preserveNullAndEmptyArrays : true
            }
        }
        return unwind ;
    }catch(err){
        throw err ;
    }
};


const set_media_count  = async() => {
    try{
        let set  = {
            $project : {
                imageCount  : { $size : "$media_details.images"},
                videoCount  : { $size : "$media_details.videos"},
                totalcount  : { $sum  : ["$imageCount" , "$videoCount"] }
            }
        }
        return set ;
    }catch(err){
        throw err ;
    }
};

const group_data = async() => {
    try{
        let group = {
            $group : {
                "_id"             : "$_id",
                "firstName"       : { $first : "$firstName"},
                "lastName"        : {$first : "$lastName"},
                "email"           : {$first :"$email"},
                "expertIndustry"  : {$first : "$expertIndustry"},
                "profilePicture"  : {$first : "$profilePicture"},
                "tags"            : {$first  : "$tags"},
                "reviews"         : {$first : "$reviews"},
                "expertise"       : {$first : "$expertise"},
                "timeZone"        : {$first : "$timeZone"},
                "isAvailable"     : {$first : "$isAvailable"},
                "reviews"         : {$first : "$reviews"},
                "address"         : {$first : "$address"},
                "rating"          : {$first : "$rating"},
                "introVideo"      : {$first : "$introVideo"},
                "mediaCount"      : {$first : "$totalcount"},
                "education"       : {$first : "$education"},
                "about"           : {$first : "$about"},
                "expertVerified"  : {$first : "$expertVerified"},
                "tags"            : {$first : "$tags"},
                "freeMinutes"     : {$first : "$freeMinutes"},
                "ratePerMinute"   : {$first : "$ratePerMinute"},
                "setAvailability" : {$first : "$setAvailability"},
                "categories"      : {
                    $addToSet : {
                        "categoryId" : "$categories_details._id",
                        "name" : "$categories_details.name",
                        "medias" : "$media_details"
                    }
                },
            }
        };
        return group ;
    }catch(err){
        throw err ;
    }
} ;

const project_data = async() => {
    try{
        let project = {
            $project : {
                _id : 1,
                firstName  : 1,
                lastName : 1,
                email : 1,
                expertIndustry : 1,
                profilePicture : 1,
                tags : 1,
                reviews : 1,
                expertise : 1,
                isAvailable :1,
                reviews :1,
                timeZone : 1,
                introVideo : 1,
                education : 1,
                about : 1  ,
                expertVerified : 1,
                tags : 1, 
                address : 1,
                rating : 1,
                mediaCount : 1,
                freeMinutes : 1,
                ratePerMinute :1,
                setAvailability :1,
                categories : {
                    $cond: { if: { $eq: [ "$categories", [{}] ] }, then: [], else : "$categories" }
                },
            }
        } ;
        return project ;
    }catch(err){
        throw err ;
    }
} ;

const sort_data = async() => {
    try{
        let sortData = {
           
            $sort: {
    
                _id : -1
                
            }
        };
        return sortData ;
    }catch(err){
        throw err ;
    }
};


const skip__data = async(pageNumber) =>
{
    try{
        let skip = {
            $skip : pageNumber
        };
        return skip ;
    }catch(err){
        throw err ;
    }
};
const limit_data = async(limits) =>
{
    try{
        let limit = {
            $limit : limits
        }
    

        return limit ;
    }catch(err){
        throw err ;
    }
};


const list_data = async(payloadData,limits,pageNumber) => {
    try{
        let match = await match_id(payloadData) ;
        let lookupCategies = await lookup_categies() ;
        let unwindCategory = await unwind_category();
        let lookupedia = await lookup_media() ;
       // let unwindMeedia = await unwind_media();
        //let media_count= await set_media_count();
        let groupData = await group_data();
        let projectData = await project_data();
        let sortData = await sort_data();
        let skip_data = await skip__data(parseInt(pageNumber));
        let limitData ;
        if(limits != 0){
            limitData =  await limit_data(parseInt(limits)) ;
        }
        else{
            limitData =  await limit_data(parseInt(10000)) 
        }
       
        
       
       
        let query = [
            match,
            lookupCategies,
            unwindCategory,
            lookupedia,
           // unwindMeedia ,
            groupData,
            projectData,
            sortData,
            skip_data,
            limitData,
            
        ] 
        console.log("query =======>")
        let populate = [
            {
                path : "expertIndustry",
                select : "_id name "
            },
        ]
        
        let options = { lean : true };
        
        let aggreated_details = await DAO.aggregateDataWithPopulate(Models.users,query,populate,options);
        let array = [] ;

        let current_date = moment().format('x') ;
        if(aggreated_details.length != 0){

            for(let data of aggreated_details){
                
                
                data.isFavourite = false ; 

                // data.past_call_days = 0 ;

                let favouriteData = await DAO.getData(Models.favourite_experts ,{ userId : payloadData._id, favoriteId : data._id,isFavourite : true} , {__v:0} , {lean : true}) ;
                
                let called_details = await DAO.getData(Models.calls_scheduling, { userId : payloadData._id , expertId : data._id ,live_video_call_status : "Completed",video_call_status : "Completed"} , { __v : 0 } , { lean : true }) ;
                // console.log("called_details console =======>",called_details) ;
                if(called_details.length != 0 ) {
                    for(let result of called_details) {


                        data.past_call_days = result.call_time_end ;

                    }

                }
                // console.log('favouriteData',favouriteData) ;
                if(favouriteData.length != 0)
                {
                    data.isFavourite = true ;
                }else{
                    data.isFavourite = false ;
                } ;
                let categories = data.categories;
                if(categories.length != 0){
                    
                    data.categories = categories.sort((a, b) => a.categoryId > b.categoryId ? 1 : -1)
                    var imageCount = 0; 
                    var videoCount = 0; 
                    var totalcount = 0; 
                  
                    for(let cat of categories){
                       
                        let newMedia = cat.medias
                        if(newMedia != [{}] && newMedia.length != 0 ){
                            
                            for(let media of newMedia){
                                
                                media.imageCount += media.images.length ;
                                media.videoCount += media.videos.length ;
                                media.totalcount = media.imageCount + media.videoCount ;
                                imageCount += media.images.length ;
                                videoCount += media.videos.length ; 
                                totalcount += media.imageCount + media.videoCount ;
            
                            } 
                        }
                    }
                    data.imageCount = imageCount; 
                    data.videoCount = videoCount; 
                    data.totalcount = totalcount; 
                } ;


                if(payloadData.search)
                {
                    console.log("===========+>",payloadData.search) ;
                    let questions = payloadData.search ; 
                    // .trim() ;
                    console.log("=after trimimg==========+>",questions) ;

                    let question_in_array = questions.split() ;

                    console.log("question_in_array ===========+>",question_in_array) ;
                    // let question_in_array1 = question_in_array ;
                    if(question_in_array.length != 0 ){
                        for(let ques of question_in_array){
                            console.log("ques-------",ques) ;

                            let condtion = {
                                    _id : data._id,
                                    $or : [
                                          { firstName : {$regex : ques , $options : "i"  } } ,
                                          { tags : { $in : [ques] } },
                                          {fullName : { $regex : ques , $options : "i"  } },
                                          { lastName : { $regex : ques , $options : "i"  } } ,
                                          { address : {$regex : ques , $options : "i"  } } ,
                                    ],
                                    isDeleted : false,
                                    isBlocked : false
                              };
                            let get_data = await DAO.getData(Models.users,condtion,{__v : 0},{lean : true}) ;
                            console.log("get_data =====>",get_data) ;
                            if(get_data.length != 0 ){
                                let conditions = {
                                    history : payloadData.search,
                                    isDeleted : false,
                                    userId : payloadData._id,
                                };
                                let pojection = {__v : 0} ;
                                let optios = {lean : true};
                                let get_history = await DAO.getData(Models.search_history,conditions,pojection,optios) ;

                                if(get_history.length == 0){
                                    let data1 ={
                                        userId : payloadData._id,
                                        history : payloadData.search
                                    }
                                    let searched_history = await DAO.saveData(Models.search_history,data1) ;
                                }else{
                                    let data_to_remove ={
                                        userId : payloadData._id,
                                        history : payloadData.search
                                    };
                                    let replaced_data={
                                        userId : payloadData._id,
                                        history : payloadData.search
                                    }
                                    let remove_old_detail = await DAO.remove(Models.search_history,data_to_remove ) ;
                                    let searched_history = await DAO.saveData(Models.search_history,replaced_data) ;

                                }

                                array.push(data);
                                
                                
                            }else{
                                let newNAme = data.expertIndustry.name ;
                                if( newNAme.toLowerCase() == ques.toLowerCase()){
                                    let condtion = {
                                        isDeleted : false,
                                        // name : { $regex : ques , $options : "i" },
                                        // _id : data.expertIndustry._id
                                    };
                                    let get_data = await DAO.getData(Models.industries,condtion,{__v : 0},{lean : true}) ;
                                    if(get_data != null){
                                        let conditions = {
                                            history : payloadData.search,
                                            isDeleted : false,
                                            userId : payloadData._id,
                                        };
                                        let pojection = {__v : 0} ;
                                        let optios = {lean : true};
                                        let get_history = await DAO.getData(Models.search_history,conditions,pojection,optios) ;
        
                                        if(get_history.length == 0){
                                            let data1 ={
                                                userId : payloadData._id,
                                                history : payloadData.search
                                            }
                                            let searched_history = await DAO.saveData(Models.search_history,data1) ;
                                        }else{
                                            let data_to_remove ={
                                                userId : payloadData._id,
                                                history : payloadData.search
                                            };
                                            let replaced_data={
                                                userId : payloadData._id,
                                                history : payloadData.search
                                            }
                                            let remove_old_detail = await DAO.remove(Models.search_history,data_to_remove ) ;
                                            let searched_history = await DAO.saveData(Models.search_history,replaced_data) ;
        
                                        }

                                        array.push(data);
                                      
                                    }

                                }  
                            }    
                        }
                    }  
                }
            }
        }

        if(payloadData.search){
            
            if(array.length != 0){

                    let uniqueArray = array.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                    t._id === value._id
                    ))
                   )
    
                   return uniqueArray
            }
            else{
                return []
            }
            
        }
        else{

            return aggreated_details ;
        }

        
    }catch(err){
        throw err ;
    }
}



module.exports = { 
    list_data : list_data

}

