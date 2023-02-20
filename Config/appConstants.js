var SERVER = {
  APP_NAME: "AlTask",
  SECRET: "",
  SALT: 11,
  JWT_SECRET_KEY_USER: "gff%$TGMJ^rztt",
  JWT_SECRET_KEY_ADMIN: "gff%$TGMJ^rztt",
  MAX_DISTANCE_RADIUS_TO_SEARCH: 10000,
  NOTIFICATION_KEY: ""

};

var swaggerDefaultResponseMessages = [
  { code: 200, message: "OK" },
  { code: 400, message: "Bad Request" },
  { code: 401, message: "Unauthorized" },
  { code: 404, message: "Data Not Found" },
  { code: 500, message: "Internal Server Error" }
];

var SCOPE = {
  USER: "USER",
  ADMIN: "ADMIN",
};

var GENDER = {
  MALE:"MALE",
  FEMALE:"FEMALE"

}

var APP_CONSTANTS = {
  SCOPE:SCOPE,
  swaggerDefaultResponseMessages:swaggerDefaultResponseMessages,
  SERVER:SERVER,
  GENDER:GENDER
};

module.exports = APP_CONSTANTS;
