const express = require('express')
const { create, getNews,deleteNews, UpdateNews, GetBlogImage,getNewsByUUID } = require('../Controllers/admin.controller')
const multer = require('multer')
const {authentication} = require('../Middleware/authentication')
const UserRouter = express.Router()











const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})


// below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {


    req.body.FileFormat = file.mimetype
    cb(null, true)

}

const upload = multer({ storage: storage, fileFilter: filefilter });



/** Send OTP for Verification */
//UserRouter.post('/sendOTPforEmail', OTPforSignUp)

/** Signup Router */
//UserRouter.post('/SignUp', Signup)

/*** Login Router */
//UserRouter.post('/login', Login)


/** Sending OTP to Reset Password */
//UserRouter.put('/otpforResetPassword', updateVerify)

/** To Reset Password */
//UserRouter.put('/resetPassword', ResetPassword)


/** To Get All News */
UserRouter.get('/news',getNews)

/** To Get Blog Image */
UserRouter.get('/blogImage/:filename',GetBlogImage)


 /**    authentication Middleware    */
// UserRouter.use(authentication)

/** To Create News */
UserRouter.post('/createNews', upload.single('BlogImage'), create)

/** To Delete News  */
UserRouter.delete('/delete', deleteNews)
UserRouter.get('/news/edit', getNewsByUUID);


/** To Update News */
UserRouter.patch('/updateNews',upload.single('UpdateNewsImage'),UpdateNews)

module.exports = { UserRouter } 
