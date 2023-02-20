const Hapi = require('hapi'),
path = require('path'),
    Config = require('./Config'),
    Plugins = require('./Plugins'),
    winston = require('winston');
    https = require('https');
    DAO = require('./DAOManager').queries;
    Models = require('./Models/');
    mongoose = require('mongoose');
    // const poll_job = require("./Controller/notificationController").start_poll_cron ;
    const meet_job = require("./Controller/notificationController").start_meeting_cron ;
    const start_qa_cron = require("./Controller/notificationController").start_qa_cron ;

     
    // const nodeCron = require("./Controller/notificationController").cron_job 
    
    global.ObjectId = mongoose.Types.ObjectId;


  
const numCPUs = require('os').cpus().length;

console.log("====numCPUs=======",numCPUs)


if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'client' && process.env.NODE_ENV !== 'yetoTesting') {
      console.log(
            `Please specify one of the following environments to run your server
                  - development
                  - production

      Example :NODE_ENV=development pm2 start server.js --log-date-format 'DD-MM HH:mm:ss.SSS' --name="dev"`
      );
      process.env.NODE_ENV ='development'
}


Routes = require('./Routes');
bootstrap = require('./Utils/bootstrap');

process.env.NODE_CONFIG_DIR = __dirname + '/Config/';


let server = new Hapi.Server({
    app: {
        name: Config.APP_CONSTANTS.SERVER.APP_NAME
    },
    cache: { engine: require('catbox-memory'), name: 'memory' },
    port:Config[process.env.NODE_ENV].port,
    routes: {
        cors : true,
        payload: {
            maxBytes:  1048576000,
          },
    } 
});



process.on('uncaughtException',(code) => {
    console.log(`About to exit with code: ${code}`);
});


process.on('unhandledRejection',(code) => {
    console.log(`About to exit with code: ${code}`);
});

(async initServer => {

    // Register All Plugins
      await server.register(Plugins);

    // API Routes
       await server.route(Routes);
       

    server.route(
        [{
        method: 'GET',
        path: '/',
        handler: (request, reply)=> {
            return "Welcome back "
            
        },
        config: {
            auth: false
        }
        }]
    );

    // hapi swagger workaround(but a ugly hack for version 9.0.1)
    server.ext('onRequest', async (request, h) => {
        request.headers['x-forwarded-host'] = (request.headers['x-forwarded-host'] || request.info.host);
        return h.continue;
    });


    process.on('uncaughtException',(err)=>{
        console.log("==============uncaughtException=================",err)
    });


    process.on('unhandledRejection',(err)=>{
        console.log("==============unhandledRejection=================",err)
    });

    // Start Server
    try {
        await server.start();
        await start_qa_cron.start() ;
        //let data = await job;
        // await poll_job.start();
        await meet_job.start() ;
        // await start_task_cron.start() ;

        // await tones_job.start() ;
       
        let findAdmin = await DAO.getData(Models.admins,{email:"admin@gmail.com"},{_id:1},{lean:true},);
        
        if(!(findAdmin.length)){
            let saveData = [
                {
                    email : "admin@gmail.com",
                    password : "qwerty"
                },
                {
                    email : "admin2@gmail.com",
                    password : "qwerty"
                },
                {
                    email : "admin3@gmail.com",
                    password : "qwerty"
                }

            ]

            findAdmin = await DAO.insertMany(Models.admins,saveData,{multi : true});
        }
        
        winston.log("info",`Server running at ${server.info.uri}`);
    } catch (error) {
        winston.log("info",error);
    }
})();

