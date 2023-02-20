
function saveData(model,data) {
    return new Promise((resolve, reject) => {
        try {
            let saveData = model.create(data);
            return resolve(saveData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataUser(model, query, projection, options, pagenumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).limit(10).skip(pagenumber).sort({ _id : -1 });
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}
function populateDataUser(model, query, projection,options,collectionOptions,pagenumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection,options).limit(10).skip(pagenumber).populate(collectionOptions).sort({_id : -1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}
function getDataSort(model, query, projection, options, pagenumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).skip(pagenumber).sort({_id:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function populateDataAdmin(model, query, projection, options, pageNumber,collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).limit(100).skip(pageNumber).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}


function getDataPages(model,query,projection,option,pageNumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query,projection,option).limit(10).skip(pageNumber);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataNotification(model, query, projection, options, pagenumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).skip(pagenumber).limit(10).sort({createdAt:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}


function getArts(model, query, projection, options,limit) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).limit(limit).sort({createdAt:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}


function get_count(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).estimatedDocumentCount().sort({createdAt:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataAdmin(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getData(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).sort({_id : -1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}
function getDataLatest(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).sort({startingDate : -1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataSession(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).sort({createdAt:-1}).sort({startTime:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}



function getDataSort(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).sort({name : 1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataSkip(model, query, projection, options,pageNumber) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).skip(pageNumber);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}



function getDataOne(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.findOne(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getUniqueData(model,keyName,query, options) {
    return new Promise((resolve, reject) => {
        try {
            let getUniqueData = model.distinct(keyName, query, options);
            return resolve(getUniqueData);
        } catch (err) {
            return reject(err);
        }
    });
}




function findAndUpdate(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.findOneAndUpdate(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function updateMany(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.updateMany(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function update(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.update(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function remove(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.deleteMany(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function remove1(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.deleteOne(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function populateData(model, query, projection, options, collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).sort({createdAt:-1}).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}


function populateSingleData(model, query, projection, options, collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.findOne(query, projection, options).sort({createdAt:-1}).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function populateChatData(model, query, projection, options, collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).sort({time : 1}).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}
function populate_Data(model, query, projection, options, collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).sort({ _id : -1 }).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

function populate_Data_favourite(model, query, projection, options,limitNumber,pageNumber,collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).limit(limitNumber).skip(pageNumber).sort({ updatedAt : -1 }).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}





async function deepPopulateData(model, query, projection, options, collectionOptions,populateOptions) {

        try {
            let data = await model.find(query, projection, options).populate(collectionOptions).exec();
            // console.log("=======data===========",data[0].favourites)
            let populateData = await model.populate(data,populateOptions);
            return (populateData);
        }
        catch (err) {
            return err;
        }
}

function count(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.countDocuments(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function  aggregatedata(model,group){
    return new Promise((resolve, reject) => {
        try {
            let getdata = model.aggregate(group);
            
            return resolve( getdata);
        } catch (err) {
            return reject(err);
        }

    });
}

function aggregateData(model, group,options) {
    return new Promise((resolve, reject) => {
        try {
            let data;

            if(options !==undefined){
                data = model.aggregate(group).option(options);
            }
            else{
                data = model.aggregate(group);
            }

            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
} ;
function aggregateData1(model, group,options,pageNumber) {
    return new Promise((resolve, reject) => {
        try {
            let data;

            if(options !==undefined){
                data = model.aggregate(group).option(options).limit(10).skip(pageNumber);
            }
            else{
                data = model.aggregate(group).limit(10).skip(pageNumber);
            }

            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function insert(model, data, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.collection.insert(data,options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function insertMany(model, insert, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.collection.insertMany(insert,options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

let bulkFindAndUpdate= (bulk,query,update,options)=> {
    bulk.find(query).upsert().update(update,options);
};

let bulkFindAndUpdateOne= (bulk,query,update,options)=> {
    bulk.find(query).upsert().updateOne(update,options);
};

async function aggregateDataWithPopulate(model, group, populateOptions,options) {
    try {
        // console.log("========options==========",options)
        let aggregateData;
        if(options !==undefined){
            aggregateData = await model.aggregate(group).option(options);
        }
        else{
            aggregateData = await model.aggregate(group);
        }
        // console.log("=========aggregateData============",aggregateData.length)
        let populateData = await model.populate(aggregateData,populateOptions);
        
        
        // console.log("=======populateData===========",populateData.length)
        return populateData;
    } catch (err) {
        return err;
    }
}


function getDataProduct(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options).sort({createdAt:-1});
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

module.exports = {
    saveData : saveData,
    getData : getData,
    getDataOne : getDataOne,
    update : update,
    remove: remove,
    remove1: remove1,
    insert: insert,
    getDataUser:getDataUser,
    insertMany: insertMany,
    getDataPages : getDataPages,
    getUniqueData : getUniqueData,
    get_count:get_count,
    count: count,
    getDataProduct:getDataProduct,
    getArts:getArts,
    findAndUpdate : findAndUpdate,
    populateData : populateData,
    populate_Data : populate_Data,
    aggregatedata:aggregatedata,
    aggregateData : aggregateData,
    aggregateDataWithPopulate: aggregateDataWithPopulate,
    bulkFindAndUpdate : bulkFindAndUpdate,
    deepPopulateData:deepPopulateData,
    populateDataAdmin:populateDataAdmin,
    bulkFindAndUpdateOne : bulkFindAndUpdateOne,
    getDataSort :getDataSort,
    updateMany :updateMany,
    getDataSkip : getDataSkip,
    getDataAdmin:getDataAdmin,
    getDataNotification : getDataNotification,
    getDataSession :getDataSession,
    getDataSort : getDataSort,
    getDataLatest : getDataLatest,
    populateDataUser : populateDataUser,
    populateChatData :populateChatData,
    aggregateData1 : aggregateData1,
    populate_Data_favourite : populate_Data_favourite,
    populateSingleData : populateSingleData

};