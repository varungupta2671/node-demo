var Config = require('../Config');
var UniversalFunctions = require('../Utils/UniversalFunctions');
var async = require('async');
var Path = require('path');
var knox = require('knox');
var fsExtra = require('fs-extra');
var Fs = require('fs');
var AWS = require("aws-sdk");
var mime = require('mime-types');
var aws = require('../Config/awsS3Config');
const getVideoInfo = require('get-video-info');



AWS.config.update({
    accessKeyId: aws.s3BucketCredentials.accessKeyId,
    secretAccessKey: aws.s3BucketCredentials.secretAccessKey
    //  region:' '
});
var s3 = new AWS.S3();

function uploadMultipart(fileInfo, uploadCb) {
    var options = {
        // Bucket: aws.s3BucketCredentials.bucket,
        // Key: fileInfo.filename,
        // ACL: 'public-read',
        // ContentType: mime.lookup(fileInfo.filename),
        // ServerSideEncryption: 'AES256'

        Bucket: aws.s3BucketCredentials.bucket,
        Key: fileInfo.filename,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: mime.lookup(fileInfo.filename),
        ACL:'public-read'
    };

    s3.createMultipartUpload(options, (mpErr, multipart) => {
        if (!mpErr) {
            //console.log("multipart created", multipart.UploadId);
            Fs.readFile(fileInfo.path, (err, fileData) => {

                var partSize = 5242880;
                var parts = Math.ceil(fileData.length / partSize);

                async.times(parts, (partNum, next) => {

                    var rangeStart = partNum * partSize;
                    var end = Math.min(rangeStart + partSize, fileData.length);

                    partNum++;
                    async.retry((retryCb) => {
                        s3.uploadPart({
                            Body: fileData.slice(rangeStart, end),
                            Bucket: aws.s3BucketCredentials.bucket,
                            Key: fileInfo.filename,
                            PartNumber: partNum,
                            UploadId: multipart.UploadId
                        }, (err, mData) => {
                            retryCb(err, mData);
                        });
                    }, (err, data) => {
                        console.log(data);
                        next(err, {ETag: data.ETag, PartNumber: partNum});
                    });

                }, (err, dataPacks) => {
                    s3.completeMultipartUpload({
                        Bucket: aws.s3BucketCredentials.bucket,
                        Key: fileInfo.filename,
                        MultipartUpload: {
                            Parts: dataPacks
                        },
                        UploadId: multipart.UploadId
                    }, uploadCb);
                });
            });
        } else {
            uploadCb(mpErr);
        }
    });
}

function uploadFile1(fileObj, uploadCb) {
    var fileName = Path.basename(fileObj.finalUrl);
    var stats = Fs.statSync(fileObj.path);

    var fileSizeInBytes = stats["size"];

    if (fileSizeInBytes < 5242880) {
       // async.retry((retryCb) => {
            Fs.readFile(fileObj.path, (err, fileData) => {
                s3.putObject({
                    Bucket: aws.s3BucketCredentials.bucket,
                    Key: fileName,
                    Body: fileData,
                    ContentType: mime.lookup(fileName)
                }, (err)=>{uploadCb()});
            });
    } else {
        fileObj.filename = fileName;
        uploadMultipart(fileObj, uploadCb)
    }
}


var uploadFilesOnS3 = function (fileData, callback) {

    var imageFile = false;
    var filename;
    var ext;
    var dataToUpload = []

    //check file data
    if (!fileData || !fileData.filename) {
        return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        filename = fileData.filename.toString();
        ext = filename.substr(filename.lastIndexOf('.'))
        var videosFilesExt = ['.3gp', '.3GP', '.mp4', '.MP4', '.avi', '.AVI'];
        var imageFilesExt = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.gif', '.GIF'];


        console.log(".......ext.......",ext);
        if (ext) {
            if (imageFilesExt.indexOf(ext) >= 0) {
                imageFile = true
            } else {
                if (!(videosFilesExt.indexOf(ext) >= 0)) {
                    return callback()
                }
            }
        } else {

        console.log(".......ext....callback...");
            return callback()
        }
    }

    //  create file names ==============

    let milli = +new Date();
    fileData.original = UniversalFunctions.getFileNameWithUserId(false, filename,milli);
    fileData.thumb = UniversalFunctions.getFileNameWithUserId(true, imageFile && filename || (filename.substr(0, filename.lastIndexOf('.'))) + '.jpg',milli);


    // for set parrallel uploads on s3 bucket

    // dataToUpload.push({
    //     path: Path.resolve('.') + '/uploads/' + fileData.thumb,
    //     finalUrl: Config.awsS3Config.s3BucketCredentials.s3URL + fileData.thumb,
    // })

    dataToUpload.push({
        path: fileData.path,
        finalUrl: aws.s3BucketCredentials.s3URL + fileData.original
    })

    async.auto({
        checkVideoDuration: function (cb) {
            if (!imageFile) {
                getVideoInfo(fileData.path).then(info => {
                    if (info.format.duration < 10) {
                        cb()
                    } else {
                        cb()
                    }
                })
            } else {
                cb()
            }
        },
        creatingThumb: ['checkVideoDuration', function (err,cb) {
            if (imageFile) {
                console.log('=======  IMAGE ===============')
                // createThumbnailImage(fileData.path, Path.resolve('.') + '/uploads/' + fileData.thumb, function (err) {
                //     cb()
                // })
                cb()
            } else {
                console.log('=======  VIDEO ===============')
                cb()
                // createVideoThumb(fileData, Path.resolve('.') + '/uploads/' + fileData.thumb, function (err) {
                //     cb(err)
                // })
            }
        }],
        uploadOnS3: ['creatingThumb', function (err,cb) {
            // var functionsArray = [];

            // var i =0;
            // dataToUpload.forEach(function (obj) {
            //     console.log('ttttttttttt',obj)
            //     i++;
            //     functionsArray.push((function (data) {
            //         return function (internalCb) {
            //             uploadFile1(data, internalCb)
            //         }
            //     })(obj))
            // });


            uploadFile1(dataToUpload[0],function(err,result){
                console.log("....return function...");
                if(err){
                    cb(err)
                }else{
                    cb(null)
                }
            })
        }]
    }, function (err) {
        let responseObject = {
            original: aws.s3BucketCredentials.s3URL + fileData.original,
            thumbnail: aws.s3BucketCredentials.s3URL + fileData.original,
            type: imageFile && 'IMAGE' || 'VIDEO'
        };
        console.log("......responseObject.......",responseObject);
        callback(err, dataToUpload);
    })
};

function deleteFile(path) {
    fsExtra.remove(path, function (err) {
    });
}
/*
function createThumbnailImage(originalPath, thumbnailPath, callback) {
    var gm = require('gm').subClass({imageMagick: true});
    gm(originalPath)
        .resize(Config.APP_CONSTANTS.SERVER.THUMB_WIDTH, Config.APP_CONSTANTS.SERVER.THUMB_HEIGHT, "!")
        .autoOrient()
        .write(thumbnailPath, function (err, data) {
            callback(err)
        })
};*/

function createThumbnailImage(originalPath, thumbnailPath, callback) {
    var gm = require('gm').subClass({imageMagick: true});

    var readStream = Fs.createReadStream(originalPath);
    gm(readStream)
        .size({bufferStream: true}, function (err, size) {
            console.log("sixw***********",size)
            if (size){
                this.thumb(size.width ,size.height,thumbnailPath,10,
                    /* .autoOrient()
                    .write(thumbnailPath1,*/ function (err, data) {
                        callback(err)
                    })
            }
            /*  if (size.width > 200) {
                  this.resize(200, (size.height / size.width) * 200)
              } else {
                  this.resize(100, (size.height / size.width) * 100)
              }*/
        });
}



module.exports = {
    uploadFilesOnS3: uploadFilesOnS3,
    uploadMultipart : uploadMultipart,
    uploadFile1 : uploadFile1

};
