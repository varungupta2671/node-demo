const twillio = require('../Config/twilioConfig') ;

const account_sid = twillio.TWILIO_ACCOUNT_SID;
//  "AC125faca23fe09f3374c4f3a2adbd7a0d"


const auth_token = "7083a86b2577450cc157aadc189269e2" ;
//  twillio.TWILIO_API_SECRET ;
//  "65726007c8a7c5e667a6435f76eae433"
// twillio.TWILIO_API_KEY ;
// '35f1fb9d0d62239ff1fe0aa15f336ac2';

const client = require('twilio')(account_sid, auth_token);
const twillo_phone_no = "+18593281753" ;
// "+15074485375"




const send_sms = async(country_code , phone_no , body) => {
      try {
            console.log("phone number ===>",country_code+phone_no ) ;
            console.log("keys are her =====>",account_sid , auth_token) ;

            let options = {
                  body : body,
                  from : twillo_phone_no,
                  to : country_code+phone_no
            } ;
            console.log("------------------",options)

            await client.messages.create(options).then(
                message => console.log("send_message ->",message)
            );


      }
      catch(err) {
            console.log("------------------err-",err.message)
            // throw err;
      }
        
}

module.exports={
    send_sms : send_sms,
};