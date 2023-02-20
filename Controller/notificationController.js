
const DAO = require("../DAOManager").queries;
const moment = require('moment');
const Config = require("../Config");
const Models = require("../Models");
var CronJob = require('cron').CronJob;
const NotificationsManager = require("../Libs/NotificationsManager");
const commonController =  require("./commonController");
// var moment = require('moment');

const RADIUS = 20;

const fetch_upcoming_polls = async() => {
  try{
    let Model = Models.polls ;
    let query = {
      is_deleted : false,
      status : "upcoming"
    };
    let return_data = await DAO.getData(Model,query,{__v  : 0},{lean : true}) ;
    return  return_data ;
  }catch(err){
    throw err ;
  };
};

const fetch_upcoming_meetings = async() =>{
  try{ 
    let query = {
      is_deleted : false,
      status : "upcoming"
    };
    let get_data = await DAO.getData(Models.meetings,query,{__v : 0},{lean : true}) ;
    return get_data  ;
  }catch(err){
    throw err ;
  }
};

const start_task_cron = new CronJob('* 23 * * *',async() => {
  try{
    let Model = Models.tasks ;
    console.log(" -------- task cron is working ---------") ;
    // let next_day_in_millis =  moment().add(1,'day').endOf('day').format('x') ;
    let current_time = moment().format('x') ;
    // console.log("current_time  in tasks======",current_time) ;
    // let all_tasks = await fetch_tasks() ;
    
    // if(all_tasks.length != 0){
    //   for(let task of all_tasks){
    //     /*** change the status to overdue if time ends in tasks */
    //     if(task.end_date < current_time){
    //       let queries = {
    //         _id : task._id,
    //         // is_deleted : false
    //       };
    //       let update = {status : "Overdue"  } ;
    //       let update_task_data = await DAO.findAndUpdate(Model,queries,update,{new : true }) ;
    //     }
    //   }
    // }
  }catch(err){
    throw err ;
  };
});

const start_meeting_cron = new CronJob('* * * * *',async()=> {
  try{
    console.log("meeting cron is working ----") ;
    let all_meeting = await fetch_upcoming_meetings() ;
    // console.log("all_meeting -----",all_meeting.length) ;
    if(all_meeting.length != 0){
      for(let meet of all_meeting){
        // console.log("meet -----",meet) ;
        let timeZone = meet.time_zone ;
        let current_time = moment().tz(timeZone).format("HH:mm");
        // console.log("current_time ======",current_time);
        let hours_minutes = await commonController.managed_timing(current_time) ;
        // console.log("hours_minutes ======",hours_minutes);
        let current_date_string = moment().tz(timeZone).format('YYYY-MM-DD') ;
        // console.log("current_date_string ======",current_date_string);
        let current_date_string1 = moment().tz(timeZone).format('YYYY/MM/DD') ;
        // console.log("current_date_string1 ======",current_date_string1);
        // if(meet.end_time == hours_minutes &&  meet.end_date_in_string  == current_date_string1){
          let query = {
            _id : meet._id,
            is_deleted : false,
            end_date_in_string : current_date_string,
            end_time  : { $lt : hours_minutes  }
          };
          let data_for_update = { status : "completed" } ;
          let update_db = await DAO.findAndUpdate(Models.meetings,query,data_for_update,{new : true }) ;
          // console.log("update_db ======",update_db);
          // return update_db ;
        // };
      }
    };
  }catch(error){
    throw error  ;
  }
});

const start_poll_cron = new CronJob('* 23 * * *',async()=>{
  try{
    console.log(" start_poll_cron 9is working") ;
    // let next_day_in_millis =  moment().add(1,'day').endOf('day').format('x') ;
    // console.log("next_day_in_millis  in start poll ------->>>>",next_day_in_millis) ;
    let cuurent_date = moment().format('x');
    let all_polls = await fetch_upcoming_polls() ;
    if(all_polls.length != 0){
      for(let poll of all_polls){
        if(poll.end_date < cuurent_date){
          let condition = {
            _id : poll._id,
            // is_deleted  : false
          };
          let update = { status : "completed" };
          const update_data = await DAO.findAndUpdate(Models.polls,condition,update,{new : true}) ;
        };
      };
    };
  }catch(err){
    throw err ;
  }
});

const send_chat_notification = async(reciver_id,chat_id,sender_id,message) =>{
  try{
    let get_token = await fetch_user_token(reciver_id) ;
    let noti_object ={
      sender_id : sender_id,
      reciever_id : reciver_id,
      type : "CHATS",
      message : message ,
      title : "New Message",
      chat_id : chat_id ,
      time : moment().format('x'),
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
}

// const birth_wish_cron = new CronJob('0 0 * * *',async()=>{
//   try{
//     let cuurent_date = moment().format('DD');
//     let current_month = moment().format("MM") ;
//     let final_date = cuurent_date + "/" + current_month ; 
//     let query ={
//       date_and_month : final_date
//     }
   

//   }catch(err){
//     throw err ;
//   }
// });

// const get_birthday_of_users = async() =>{
//   try{
   
//   }catch(err){
//     throw err ;
//   }
// }


const fetch_user_token = async(userid) => {
  try{
    let device_token = null ;
    let Model = Models.users ;
    let condition = {  _id : userid } ;
    let get_token = await DAO.getData(Model,condition,{__v : 0},{lean : true} ) ;
    if(get_token.length != 0){
      device_token = get_token[0].deviceToken ;
    };
    return device_token ;
  }catch(err){
    throw err ;
  };
};

const send_task_complete_notification  = async(functionData) => {
  try{
    let get_token = await fetch_user_token(functionData.reciever_id) ;
    let noti_data = {
      reciever_id : functionData.reciever_id,
      sender_id : functionData.sender_id,
      type : functionData.type,
      title : functionData.title,
      task_id : functionData.task_id,
      highlight_message : functionData.highlight_message,
      date : functionData.date,
      task_video : functionData.task_video,
      message : functionData.message,
      task_title : functionData.task_title,
      task_description : functionData.task_description,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_data) ;
    // console.log("save_noti  --------",save_noti) ;
    if(get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_data,get_token) ;
    };
  }catch(err){
    throw err ;
  };
};

const send_reward_notification = async(data) =>{
  try{
    let get_token = await fetch_user_token(data.user_id) ;
    let message = `Congratulation! You have recieved ${data.ammount} coins.`
    // let title = 
    let noti_object = {
      type : "COIN_REWARD",
      reciever_id : data.user_id,
      sender_id : data.sender_id,
      title : "Reward Recieved",
      message : message ,
      date : data.date,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
};

const send_task_assign_noti = async(data,user_id) =>{
  try{
    let get_token = await fetch_user_token(data.user_id) ;
    let current_date = moment().format('x') ;
    let task_creater_detail = await DAO.getDataOne(Models.users,{_id : user_id},{full_name : 1},{lean : true}) ;
    let message = `${task_creater_detail.full_name} has assigned a task to you.`
    // let title = 
    let noti_object = {
      type : "TASK_ASSIGN",
      reciever_id : data.member_id,
      sender_id : user_id,
      title : "Assigned Task",
      message : message ,
      date : current_date,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
};

const meet_invite_notification = async(data,user_id) =>{
  try{
    let get_token = await fetch_user_token(data.user_id) ;
    let current_date = moment().format('x') ;
    let meet_creater_detail = await DAO.getDataOne(Models.users,{ _id : user_id },{full_name : 1},{lean : true}) ;
    let message = `${meet_creater_detail.full_name} has invited you to join a meeting.`
    let noti_object = {
      type : "MEET_INVITE",
      reciever_id : data.member_id,
      sender_id : user_id,
      title : "Meeting Request",
      message : message ,
      date : current_date,
      meet_id : data.meeting_id ,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
};


const send_poll_noti = async(data,user_id) =>{
  try{
    let get_token = await fetch_user_token(data.user_id) ;
    let current_date = moment().format('x') ;
    let poll_creater_detail = await DAO.getDataOne(Models.users,{_id : user_id},{full_name : 1},{lean : true}) ;
    let message = `${poll_creater_detail.full_name} has invited you to a poll.`
    // let title = 
    let noti_object = {
      type : "POLL_INVITE",
      reciever_id : data.member_id,
      sender_id : user_id,
      title : "Poll Shared",
      message : message ,
      date : current_date,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
};

const ques_ans_assigned_noti = async(data,user_id) =>{
  try{
    let get_token = await fetch_user_token(data) ;
    let current_date = moment().format('x') ;
    let message = `please take a minute to review here.`
    let noti_object = {
      type : "Q&A",
      reciever_id : data,
      sender_id : user_id,
      title : "Q&A",
      message : message ,
      date : current_date,
    };
    let save_noti = await DAO.saveData(Models.notifications,noti_object) ;
    if( get_token != null || get_token != undefined ){
      let send_notication = await NotificationsManager.sendNotification(noti_object,get_token) ;
    };
  }catch(err){
    throw err ;
  }
};

const all_ques_attempted_by_users = async() =>{
  try{
    let Model = Models.ques_ans_members ;
    let fetch_all_ques_attempeted = [] ;
    let get_data = await DAO.getData(Model,{is_deleted : false},{ques_ans_id : 1},{lean : true} ) ;
    return get_data  ;
  }catch(err){
    throw err ;
  };
};

const start_qa_cron = new CronJob('0 0 * * *',async() =>{
  try{
    let Model = Models.ques_ans_members ;
    let all_ques = await all_ques_attempted_by_users() ;
    let fetch_all__ids = [] ;
    if(all_ques.length != 0){
      for(let data of all_ques){
        fetch_all__ids.push(data._id) ;
      };
    };
    let query ={ _id : {$in : fetch_all__ids }} ;
    let update = {respond : null,is_responded : false};
    let udpate_data = await DAO.updateMany(Model,query,update,{multi : true}) ;
  }catch(err){
    throw err ;
  }
});



module.exports = {
  fetch_user_token : fetch_user_token,
  send_task_complete_notification : send_task_complete_notification,
  start_poll_cron : start_poll_cron, 
  start_meeting_cron : start_meeting_cron  ,
  start_task_cron : start_task_cron,
  start_qa_cron : start_qa_cron,
  send_reward_notification : send_reward_notification,
  send_task_assign_noti : send_task_assign_noti,
  send_poll_noti : send_poll_noti,
  meet_invite_notification : meet_invite_notification,
  ques_ans_assigned_noti : ques_ans_assigned_noti,
  send_chat_notification : send_chat_notification
};


