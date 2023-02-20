
exports.ERROR = {
    
    NOT_ACCEPTED_EMMPTY_VIDEOS : {
        statusCode: 400,
        customMessage: {
            en : 'Please check again! Video array should  expect some value.'
        },
        type: 'NOT_ACCEPTED_EMMPTY_VIDEOS'
    },
    NOT_ADMIN :{
        statusCode : 400,
        customMessage  :{
            en : "You are not admin,cant delete channel"
        },
        type : 'NOT_ADMIN'
    },
    NOT_ACCEPTED_EMMPTY_IMAGE : {
        statusCode: 400,
        customMessage: {
            en : 'Please check again! Image array should  expect some value.'
        },
        type: 'NOT_ACCEPTED_EMMPTY_IMAGE'
    },
    CANT_OPEN_CHAT : {
      statusCode :400,
      customMessage  : {
        en : "Cant open this Chat,User is blocked"
      },
      type : "CANT_OPEN_CHAT"
    },
    NO_ANY_CARD_EXSIST : {
        statusCode: 400,
        customMessage: {
            en : 'No card is available please add card'
        },
        type: 'NO_ANY_CARD_EXSIST'
    },
    REFFERAL_ALREADY_EXISTS : {
        statusCode : 400,
        customMessage : {
            en : "Refferal code is not valid. Please check again ."
        },
        type : 'REFFERAL_ALREADY_EXISTS'
    },
    
    LINKID_IS_NOT_VALID : {
        statusCode: 400,
        customMessage: {
            en : 'link id is not valid please check again '
        },
        type: 'LINKID_IS_NOT_VALID'
    },

    TRANSATION_FAILD : {
        statusCode: 400,
        customMessage: {
            en : 'please try again transation faild'
        },
        type: 'TRANSATION_FAILD'
    },
    
    SERIAL_NO_DUPLICATE : {
        statusCode: 400,
        customMessage: {
            en : 'serial no is already exsist please check again'
        },
        type: 'SERIAL_NO_DUPLICATE'
    },
    
    INVALID_TRAIL_CODE : {
        statusCode: 400,
        customMessage: {
            en : 'trail code is not valid please check again '
        },
        type: 'INVALID_TRAIL_CODE'
    },

    TIME_TRAIL_CODE : {
        statusCode: 400,
        customMessage: {
            en : 'Trail code time is expired  '
        },
        type: 'TIME_TRAIL_CODE'
    },
    
    ENTER_POD_DURATION_TIME : {
        statusCode: 400,
        customMessage: {
            en : 'Please Enter pod duration time '
        },
        type: 'ENTER_POD_DURATION_TIME'
    },

    
    PODID_NOT_VALID : {
        statusCode: 400,
        customMessage: {
            en : 'pod id is not valid'
        },
        type: 'PODID_NOT_VALID'
    },


    DUPLICATE_PRODUCT_NAME : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! Duplicate product name.',
            sp : '¡UPS! Nombre de producto duplicado.'
        },
        type: 'DUPLICATE_PRODUCT_NAME'
    },
    
    INVALID_PRODUCT_ID : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this product id not exsist.',
            sp : '¡UPS! este ID de producto no existe'
        },
        type: 'INVALID_PRODUCT_ID'
    },
    CALL_CANNOT_CONNECT : {
        statusCode: 400,
        customMessage: {
            en : 'You cant connect right now',
        },
        type: 'CALL_CANNOT_CONNECT'
    },
    INVALID_CATEGORY_ID : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this category id not exsist.',
            sp : '¡UPS! esta identificación de categoría no existe'
        },
        type: 'INVALID_CATEGORY_ID'
    },
    INVALID_COMPANY_ID : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this company id not exsist.',
            sp : '¡UPS! esta identificación de categoría no existe'
        },
        type: 'INVALID_COMPANY_ID'
    },
    EXPERT_ALREADY_APPROVED : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this expert has already been verified.'
        },
        type: 'EXPERT_ALREADY_APPROVED'
    },
    INVALID_SUBCATEGORY_ID : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this  subcategory id not exsist.',
            sp : '¡UPS! este id de subcategoría no existe'
        },
        type: 'INVALID_SUBCATEGORY_ID'
    },
    DUPLICATE_CATEGORY_NAME : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! Duplicate category name.',
        },
        type: 'DUPLICATE_CATEGORY_NAME'
    },
    DUPLICATE_STATUS_NAME : {
        statusCode : 400,
        customMessage : {
            en : "Oops ! Duplicate status name."
        },
        type : 'DUPLICATE_STATUS_NAME'
    },
    
    DUPLICATE_SUBCATEGORY_NAME : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! Duplicate subcategory name.',
        },
        type: 'DUPLICATE_SUBCATEGORY_NAME'
    },
    
    TOKEN_INVALID : {
        statusCode:400,
        customMessage : {
            en : "token is not valid is not valid",
            sp : "el token no es válido no es válido"
            
        },
        type : "TOKEN_INVALID"
    },
    INVALID_USER_INFLUENCER_TYPE : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! this email/number is already logged in by influencer',
            sp : '¡UPS! esta identificación de categoría no existe'
        },
        type: 'INVALID_USER_INFLUENCER_TYPE'
    },
    INVALID_USER_BRAND_TYPE : {
        statusCode: 400,
        customMessage: {
            en : 'Oops!  this email/number is already logged in by brand',
            sp : '¡UPS! esta identificación de categoría no existe'
        },
        type: 'INVALID_USER_BRAND_TYPE'
    },

    
    PHONENO_ALREADY_EXIST_USER : {
        statusCode:400,
        customMessage : {
            en : "this phone number aleady exsist plese try another",
            sp : "Este número de teléfono ya existe por favor prueba otra",
        },
        type : "PHONENO_ALREADY_EXIST_USER"
    },

    INDUSTRY_NAME_ALREADY_EXISTS : {
        statusCode : 400 ,
        customMessage : {
            en : "This Industry Name Already Exists.Please try New One"
        },
        type :  "INDUSTRY_NAME_ALREADY_EXISTS" 
    } ,
    CALL_TIME_EXPERIED : {
        statusCode : 400 ,
        customMessage : {
            en : "Sorry, this call has expired. You could not connect."
        },
        type :  "CALL_TIME_EXPERIED" 
    } ,
    TRANSFER_NOT_ALLOWED : {
        statusCode : 400 ,
        customMessage : {
            en : "Sorry.transfer is not active in your vendor Id."
        },
        type :  "TRANSFER_NOT_ALLOWED" 
    },
    CANCEL_REASON_ALREADY_EXISTS : {
        statusCode : 400 ,
        customMessage : {
            en : "This Reason Name has already been used.Please Try new one ."
        },
        type : "CANCEL_REASON_ALREADY_EXISTS"
    },
    CATEGORY_NOT_EXISTS : {
        statusCode : 400 ,
        customMessage : {
            en : "This Category does not exist."
        },
        type : "CATEGORY_NOT_EXISTS"
    },

    BANK_ACCT_ALREADY_EXISTS : {
        statusCode:400,
        customMessage : {
            en : "this bank account already exists",
            sp : "Este número de teléfono ya existe por favor prueba otra",
        },
        type : "PHONENO_ALREADY_EXIST_USER"
    },
    

    INVALID_ID : {
        statusCode:400,
        customMessage : {
            en : " invalid id ",
            sp : "identificación invalida"
        },
        type : "INVALID_ID"
    },

    INVALID_TUNE_ID : {
        statusCode:400,
        customMessage : {
            en : "tune id is not valid",
            sp : 'tune id no es válido'
        },
        type : "INVALID_TUNE_ID"
    },

    INVALID_TUTORIAL_ID : {
        statusCode:400,
        customMessage : {
            en : "turorial id is not valid",
            sp : "la identificación turorial no es válida"
        },
        type : "INVALID_TUTORIAL_ID"
    },
    COMPANY_DONT_EXIST : {
        statusCode  : 400,
        customMessage : {
            en :"this addrsss _id doesnt exist.plz chck again"
        },
        type : "COMPANY_DONT_EXIST"
    },
    ADDRESS_NOT_EXIST : {
        statusCode : 400,
        customMessage : {
            en : "This address _id Dosnt exist.please check again"
        },
        type : "ADDRESS_NOT_EXIST"
    },
    ADDRESS_DETAILS_MISMATCH : {
        statusCode : 400,
        customMessage : {
            en : "This address _id and company _id doesnt matched.please check again"
        },
        type : "ADDRESS_DETAILS_MISMATCH"
    },
    
    
    NO_DATA_FOUND : {
        statusCode:400,
        customMessage : {
            en : "no data found",
            sp : 'datos no encontrados'
        },
        type : "NO_DATA_FOUND"
    },
    
    INVALID_OTP : {
        statusCode:400,
        customMessage : {
            en : "invalid otp please check again",
            sp : 'otp inválido por favor revise de nuevo'
        },
        type : "INVALID_OTP"
    },

    PHONENO_ALREADY_EXIST : {
        statusCode:400,
        customMessage : {
            en : "This mobileNumber already exsist",
            sp : 'Esta número móvil ya existe'
        },
        type : "PHONENO_ALREADY_EXIST"
    },

    CONFIRM_PASSWORD_INVALID : {
        statusCode:400,
        customMessage : {
            en : "password Mismatch ",
            sp : 'contraseña no coincide'
        },
        type : "CONFIRM_PASSWORD_INVALID"
    },
   

    BLOCKED : {
        statusCode:400,
        customMessage : {
            en : "admin blocked your profile",
            sp : "el administrador bloqueó su perfil"
        },
        type : "BLOCKED"
    },


    ALREADY_ADDED_DAY_IN_OTHER_SESSION : {
        statusCode:400,
        customMessage : {
            en : "These days already added in other session please check again "
        },
        type : "ALREADY_ADDED_DAY_IN_OTHER_SESSION"
    },

    MIN_ORDER_AMOUNT : {
        statusCode:400,
        customMessage : {
            en : "your total order amount must be greater than minimum amount"
        },
        type : "MIN_ORDER_AMOUNT"
    },

    
    NOT_FOUND: {
        statusCode: 400,
        customMessage: {
            en : 'Your Account Is temporary Blocked Please contact Admin',
            sp : 'Su cuenta está bloqueada temporalmente. Póngase en contacto con el administrador.'
        },
        type: 'NOT_FOUND'
    },

    ADD_EMAIL_ID: {
        statusCode: 400,
        customMessage: {
            en : 'please add email ids',
            sp : 'Token de acceso incorrecto'
        },
        type: 'ADD_EMAIL_ID'
    },
    DATA_NOT_FOUND  : {
        statusCode : 400,
        customMessage : {
            en  : 'cpmpny,address & email doesnot matches.'
        },
        type : 'DATA_NOT_FOUND'
    },
    COMPANY_ADDRESS_NOT_EXISTS : {
        statusCode : 400,
        customMessage : {
            en  : 'cpmpny  does not exists.'
        },
        type : 'COMPANY_ADDRESS_NOT_EXISTS'
    },
    COMPANY_ID_NOT_EXISTS : {
        statusCode : 400,
        customMessage : {
            en  : 'cpmpny address does not exists.'
        },
        type : 'COMPANY_ID_NOT_EXISTS'
    }, 
    EMPLOYEE_ALREADY_EXISTS : {
        statusCode : 400,
        customMessage : {
            en  : 'employee already exists in this company.'
        },
        type : 'EMPLOYEE_ALREADY_EXISTS'
    }, 
    EMPLOYEE_EXISTS : {
        statusCode : 400,
        customMessage : {
            en  : 'employee already exists in other address.'
        },
        type : 'EMPLOYEE_EXISTS'
    }, 
    WRONG_ACCESS_TOKEN: {
        statusCode: 400,
        customMessage: {
            en : 'Wrong access token',
            sp : 'Token de acceso incorrecto'
        },
        type: 'WRONG_ACCESS_TOKEN'
    },


    INVALID_REQUEST_ID: {
        statusCode: 400,
        customMessage: {
            en : 'Invalid Request Id',
            sp : 'ID de solicitud no válida'
        },
        type: 'INVALID_REQUEST_ID'
    } ,

    CURRENT_PASSWORD_MISMATCH: {
        statusCode: 400,
        customMessage: {
            en : 'Current Password Mismatch',
            sp : 'No coincide la contraseña anterior'
        },
        type: 'OLD_PASSWORD_MISMATCH'
    },
    CONFIRM_PASSWORD_MISMATCH: {
        statusCode: 400,
        customMessage: {
            en : 'New Password and Confirm Password Mismatches.Please try again..!',
            sp : 'No coincide la contraseña anterior'
        },
        type: 'CONFIRM_PASSWORD_MISMATCH'
    },
    RESPOND_BLOCKED : {
        statusCode: 400,
        customMessage: {
            en : 'You are not allowed to respond now !'
        },
        type: 'RESPOND_BLOCKED'
    },
    VERIFICATION_BlOCKED : {
        statusCode: 400,
        customMessage: {
            en : 'Sorry,You are not eligible for Verification Badge !'
        },
        type: 'VERIFICATION_BlOCKED'
    },


    INVALID_OBJECT_ID : {
        statusCode:400,
        customMessage : {
            en : 'Invalid Id provided.',
            sp : 'Id inválida proporcionada'
        },
        type : 'INVALID_OBJECT_ID'
    },
    NAME_ALREADY_EXISTS : {
        statusCode:400,
        customMessage : {
            en : 'Name Already Exists Please Change Name',
        },
        type : 'NAME_ALREADY_EXISTS'
    },
    CATEGORY_NAME_ALREADY_EXISTS : {
        statusCode:400,
        customMessage : {
            en : 'Category Name Already Exists Please Change Category Name',
        },
        type : 'CATEGORY_NAME_ALREADY_EXISTS'
    },

    WRONG_EMAIL_ADDRESS : {
        statusCode:400,
        customMessage : {
            en : 'The email you entered does not match any accounts.Please check your email.',
            sp : 'El correo electrónico que ingresó no coincide con ninguna cuenta. Por favor revise su correo electrónico.'
        },
        type : 'WRONG_EMAIL_ADDRESS'
    },
    
    INVALID_USER_ID : {
        statusCode:400,
        customMessage : {
            en : 'Invalid UserId provided.',
        },
        type : 'INVALID_USER_ID'
    },

    INVALID_OPERATION : {
        statusCode:400,
        customMessage : {
            en : 'Invalid operation.',
            sp : 'Operación inválida.'
        },
        type : 'INVALID_OPERATION'
    },
    DB_ERROR: {
        statusCode: 400,
        customMessage: {
            en : 'DB Error : ',
            sp : 'Error de base de datos',
        },
        type: 'DB_ERROR'
    },
    APP_ERROR: {
        statusCode: 400,
        customMessage: {
            en : 'Application Error ',
            sp : 'Error de la aplicación'
        },
        type: 'APP_ERROR'
    },
    DUPLICATE: {
        statusCode: 400,
        customMessage: {
            en : 'Duplicate Entry',
            sp : 'Entrada duplicada'
        },
        type: 'DUPLICATE'
    },
    DEFAULT: {
        statusCode: 400,
        customMessage: {
            en : 'Something went wrong.',
            sp : 'Algo salió mal.'
        },
        type: 'DEFAULT'
    },
    UNAUTHORIZED: {
        statusCode:401,
        customMessage : {
            en : 'You are not authorized to perform this action',
            sp : 'No estás autorizado para realizar esta acción.'
        },
        type : 'UNAUTHORIZED'
    },

    INVALID_CREDENTIALS : {
        statusCode: 400,
        customMessage: {
            en : 'Oops! The Phone Number or Password is incorrect.',
            sp : '¡UPS! El número de teléfono o la contraseña son incorrectos.'
        },
        type: 'INVALID_CREDENTIALS'
    },
   
    WRONG_PASSWORD: {
        statusCode: 400,
        customMessage: {
            en : 'Password is Incorrect.',
            sp : 'La contraseña es incorrecta',
        },
        type: 'WRONG_PASSWORD'
    } ,
    INSUFFICIENT_BALANCE : {
        statusCode: 400,
        customMessage: {
            en : 'Sorry ! Your balance is Insufficient'
        },
        type: 'INSUFFICIENT_BALANCE'
    } ,

    WRONG_OTP: {
        statusCode: 400,
        customMessage: {
            en : 'OTP is Incorrect.',
            sp : 'OTP es incorrecta'
        },
        type: 'WRONG_OTP'
    } ,
    USER_BLOCKED: {
        statusCode: 401,
        customMessage: {
            en : 'User Is Blocked By Admin.',
            sp : 'El usuario está bloqueado por el administrador.'
        },
        type: 'USER_BLOCKED'
    } ,
    OTP_NOT_VERIFIED: {
        statusCode: 400,
        customMessage: {
            en : 'OTP Not Verified',
            sp : 'OTP no verificada'
        },
        type: 'OTP_NOT_VERIFIED'
    } ,
    OTP_NOT_MATCH: {
        statusCode: 400,
        customMessage: {
            en :  'Invalid otp please check again',
            sp : 'OTP no verificada'
        },
        type: 'OTP_NOT_MATCH'
    } ,
     
    WRONG_ACCESS_TOKEN: {
        statusCode: 400,
        customMessage: {
            en : 'Access Token is Incorrect',
            sp : "El token de acceso es incorrecto",
        },
        type: 'WRONG_ACCESS_TOKEN'
    } ,

    OLD_WRONG_PASSWORD: {
        statusCode: 400,
        customMessage: {
            en : 'Old Password is Incorrect.',
            sp : "Antigua contraseña es incorrecta.",
        },
        type: 'OLD_WRONG_PASSWORD'
    } ,

    MOBILE_NO_NOT_FOUND: {
        statusCode:400,
        customMessage : {
            en : 'MOBILE Number not found',
            sp : 'Número de teléfono no encontrado'
        },
        type : 'MOBILE_NO_NOT_FOUND'
    },
    EMAIL_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The email address already  used. Please provide another email address',
            sp :'La dirección de correo electrónico ya utilizada. Proporcione otra dirección de correo electrónico',
        },
        type : 'EMAIL_ALREADY_EXIST'
    },
    NAME_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The Name you entered has already been used. Please provide another Name',
        },
        type : 'NAME_ALREADY_EXIST'
    },

    MOBILE_ALREADY_EXIST: {
        statusCode:400,
        customMessage : {
            en : 'The Mobile Number already used. Please provide another Mobile Number ',
            sp : 'El número de móvil ya utilizado. Por favor proporcione otro'
        },
        type : 'MOBILE_ALREADY_EXIST'
    },
    
    USER_DELETED : {
        statusCode:400,
        customMessage : {
            en : "Admin delete your profile",
            sp : "el administrador bloqueó su perfil"
        },
        type : "USER_DELETED"
    },
    ADDRESS_IS_REQUIRED :{
        statusCode : 400,
        customMessage : {
            en: "Please enter address _id"
        },
        type : "ADDRESS_IS_REQUIRED"
    },


    USER_NOT_FOUND: {
        statusCode: 404,
        customMessage: {
            en:  'Customer not found'
        },
        type : 'CUSTOMER_NOT_FOUND'
    },
    EMAIL_VALIDATION: {
        statusCode: 400,
        customMessage: {
            en:  'Email format is incorrect .please check again',
        },
        type : 'EMAIL_VALIDATION'
    },

    EMAIL_NOT_FOUND: {
        statusCode: 400,
        customMessage: {
            en:  'Email not found',
            sp : 'EL CORREO ELECTRÓNICO NO ENCONTRADO'
        },
        type : 'EMAIL_NOT_FOUND'
    },
    CREATE_COMPANY : {
        statusCode : 400,
        customMessage : {
            en : "This Company & Company Address does'nt Exist.Please Create First."
        },
        type :  "CREATE_COMPANY"
    },

};
exports.SUCCESS = {

    
    CHALLENGE_ALREADY_ONGING: {
        statusCode: 200,
        customMessage: {
            en : 'In this pod challenge alrady ongoing',
        },
        type: 'CHALLENGE_ALREADY_ONGING'
    },


    DEFAULT: {
        statusCode: 200,
        customMessage: {
            en : 'Success',
            sp : 'Éxito',
        },
        type: 'DEFAULT'
    },
    ADDED : {
        statusCode: 200,
        customMessage: {
            en : 'Added successfully.',
            sp : 'Agregado exitosamente'
        },
        type: 'ADDED'
    },
    FORGOT_PASSWORD: {
        statusCode: 200,
        customMessage: {
            en: "A reset password link is sent to your registered email address.",
            sp : 'Se envía un enlace para restablecer la contraseña a su dirección de correo electrónico registrada'
        },
        type: 'FORGOT_PASSWORD'
    },
    PASSWORD_RESET_SUCCESSFULL:{
        statusCode:200,
        customMessage:{
            en:"Your Password has been Successfully Changed",
            sp : 'Su contraseña ha sido cambiada exitosamente'
        },
        type:'PASSWORD_RESET_SUCCESSFULL'
    },
    RESET_PASSWORD:{
        statusCode:200,
        customMessage:{
            en:"A reset password OTP has been sent to your registered Phone Number",
            sp : 'Se ha enviado una contraseña de restablecimiento OTP a su número de teléfono registrado'
        },
        type: 'RESET_PASSWORD'
    }
};