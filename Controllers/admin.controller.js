
const { News } = require('../Models/News.Schema')
const { User } = require('../Models/admin.schema')
//const JWT = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
//const bcrypt = require('bcrypt')
//const nodemailer = require('nodemailer')
const Path = require('path');
const fs = require('fs')
require('dotenv').config()




/*** Nodemailer-configuration */
// let otp = {}
// let verifyEmail;
// let verifypassword;

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.Email,
//         pass: process.env.passKey
//     },
//     tls: {
//         rejectUnauthorized: false,
//     }
// })

// function generateOtp() {

//     let OTP = Math.floor(Math.random() * (1000 - 1 + 1) + 7000)

//     let onetime = OTP

//     otp.OneTimePassword = onetime

//     return OTP
// }


/** ################################################################### */
const create = async (req, res) => {
    const UUID = req.body.UUID || uuidv4(); // Use provided UUID or generate a new one
    const { Header, Description, Body, tags } = req.body;
    console.log(req.body);

    if (req.file && req.file.size) {
        /** making file in Blog_Images folder */
        try {
            /** Get the file buffer and the file format **/
            const fileBuffer = req.file.buffer;
          
            /** Define the folder path **/
            const folderPath = Path.join('Blog_Images');
      
            /** Create the folder if it doesn't exist **/
            if (!fs.existsSync(folderPath)) {
                console.log(folderPath);
                fs.mkdirSync(folderPath, { recursive: true });
            }
           
            /** Define the file path, including the desired file name and format */
            const fileName = `${UUID}${req.file.originalname}`;
            const filePath = Path.join(folderPath, fileName);
      
            /** Save the file buffer to the specified file path */
            fs.writeFileSync(filePath, fileBuffer);

            /** Prepare data for insertion or update */
            const data = {
                UUID: UUID,
                ImageURL: `https://gautamsolar.us/admin/blogImage/${UUID}${req.file.originalname}`,
                Header: Header,
                Description: Description,
                Body: Body,
                Tags: tags
            };

            /** Check if document with UUID exists */
            const existingDocument = await News.findOne({ UUID });

            if (existingDocument) {
                // Update the existing document
                await News.updateOne({ UUID }, { $set: data });
                res.send({ msg: 'Data updated successfully!', ImageURL: data.ImageURL });
            } else {
                // Insert a new document
                let insertedData = await News.insertMany(data);
                res.send({ msg: 'Data inserted successfully!', ImageURL: data.ImageURL, insertedData });
            }

        } catch (err) {
            console.log(err);
            res.status(401).send(err);
        }
    } else {
        res.status(401).send({ status: false, 'err': 'file is empty' });
    }
};


// const create = async (req, res) => {

//      const UUID = uuidv4();
//     const { Header,Description, Body,tags } = req.body;
//     console.log(req.body)
//     if(req.file.size){
//         /** making file in IPQC-Pdf-Folder*/
//         try {
//            /** Get the file buffer and the file format **/
//            const fileBuffer = req.file.buffer;
          
//            /** Define the folder path **/
//            const folderPath = Path.join('Blog_Images');
      
//            /** Create the folder if it doesn't exist **/
//            if (!fs.existsSync(folderPath)) {
//             console.log(folderPath)
//                fs.mkdirSync(folderPath, { recursive: true });
//            }
           
//            /** Define the file path, including the desired file name and format */
//            const fileName = `${UUID}${req.file.originalname}`;
//            const filePath = Path.join(folderPath, fileName);
      
//            /** Save the file buffer to the specified file path */
//         fs.writeFileSync(filePath, fileBuffer);
      
//         /** Saving Data in Database as Collection */
//     let insertedData =    await News.insertMany({
//         UUID:UUID,
//         ImageURL: `https://gautamsolar.us/admin/blogImage/${UUID}${req.file.originalname}`,
//         Header:Header,
//         Description:Description,
//         Body:Body,
//         Tags:tags
//        })
//       /** Send success response with the file URL */
//       res.send({ msg: 'Data inserted successfully!',ImageURL: `https://gautamsolar.us/admin/blogImage/${UUID}${req.file.originalname}`,insertedData });
//         } catch (err) {
//           console.log(err);
//           res.status(401).send(err);
//         }
//       }else{
//         res.status(401).send({status:false,'err':'file is empty'})
//       }

  

//     /**************************** Utilits for Frontend *****************/
//     // function formatDate(date) {
//     //     const options = { day: '2-digit', month: 'short', year: 'numeric' };
//     //     return date.toLocaleDateString('en-GB', options);
//     // }
// }

/** Get Blog Image */
const GetBlogImage = async(req,res)=>{
    const filename = req.params.filename;
     /** Define the absolute path to the IPQC-Pdf-Folder directory */
     const pdfFolderPath = Path.resolve('Blog_Images');
  
     /** Construct the full file path to the requested file */
     const filePath = Path.join(pdfFolderPath, filename);
  
     /** Send the file to the client */
     res.sendFile(filePath, (err) => {
         if (err) {
             console.error('Error sending file:', err);
             res.status(404).send({ error: 'File not found' });
         }
     });
  }

/** ################################################################### */

// const OTPforSignUp = async (req, res) => {

//     const { Email, Password } = req.body

//     let users = await User.find({ Email })


//     if (users.length && Email != "krishukumar535@gmail.com") {

//         res.status(400).send({ "message": "You are already exist User or You don't have access of it" })

//     } else {

//         let mailOptions = {
//             from: "bluearpon4567@gmail.com",
//             to: Email,
//             subject: "One Time Verification(OTP)",
//             html: `<body>
//             <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000000;">
//               <p>Dear, Admin</p>
//               <p> I hope this email finds you well. As per your request, please find below your one-time password (OTP) to verify your identity and ensure the security of your account:</p>
//               <p> <strong style="color: #ff0000;">${generateOtp()}</strong></p>
//               <p>Please note that this OTP is valid for a limited time only, so we advise that you use it as soon as possible. If you have any questions or concerns regarding this OTP, please do not hesitate to contact us.</p>
//               <p>Thank you for your trust in our services and for helping us maintain the security of your account.</p>
//               <p>Best regards,</p>
//               <p>The Verification Team</p>
//             </div>
//           </body>`



//         }

//         transporter.sendMail(mailOptions, async (err, success) => {

//             if (err) {

//                 res.status(400).send({ message: "Email is wrong" })

//             } else {

//                 console.log(otp.OneTimePassword)

//                 res.status(200).send({ "message": "OTP has Sent Succesfully!!" })

//                 verifyEmail = Email

//                 verifypassword = Password





//             }
//         })
//     }
// }


/** ################################################################### */
// const Signup = async (req, res) => {




//     let { OTP } = req.body



//     if (Number(OTP) == otp.OneTimePassword && verifyEmail !== undefined && verifypassword !== undefined) {
//         try {

//             bcrypt.hash(verifypassword, 8, async (err, hash) => {

//                 let user = new User({ Email: verifyEmail, Password: hash })

//                 await user.save()

//                 const token = JWT.sign(process.env.JWT_KEY)

//                 res.send({ "message": "User Registered!!", token: token })

//             })

//         } catch (err) {
//             console.log(err)
//             res.status(400).send({ "message": err })
//         }

//     } else {

//         res.status(400).send({ "message": "OTP is Wrong, Please try again" })

//     }
// }

/** ################################################################### */
// const Login = async (req, res) => {

//     let { Email, Password } = req.body



//     let user = await User.findOne({ Email })

//     if (user) {



//         try {
//             bcrypt.compare(Password, user.Password, function (err, result) {

//                 if (result) {

//                     const token = JWT.sign(process.env.JWT_KEY)

//                     // console.log(token)

//                     res.send({ message: "login Successfull!!", token: token })

//                 } else {

//                     res.status(404).send({ "message": "Wrong Crendtial!!" })

//                 }
//             });

//         } catch (err) {

//             res.status(400).send({ "message": "Wrong Crendtial!!" })

//         }

//     } else {
//         res.status(404).send({ message: "User doesn't Exist" })
//     }

// }


/** ################################################################### */
/************************** OTP For Reset Password ***************************/
// const updateVerify = async (req, res) => {

//     let { Email, Password } = req.body

//     let user = await User.find({ Email })

//     //console.log(user)

//     if (user.length !== 0) {

//         let mailOptions = {

//             from: "bluearpon4567@gmail.com",
//             to: Email,
//             subject: "Password Reset Request",

//             html: `<body>
//         <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000000;">
//           <p>Dear, Admin</p>
//           <p> We have received a request to reset the password for your account. Please use the following One Time Password (OTP) to reset your password:</p>
//           <p> OTP: <strong style="color: #ff0000;">${generateOtp()}</strong></p>
//           <p>To reset your password, please follow the steps below:</p>
//           <br>
//           <p>1. Go to the login page on our website.</p>
//           <p>2. Click on the "Forgot Password" link.</p>
//           <p>3. Enter your email address associated with your account.</p>
//           <p>4. Enter the OTP provided in this email.</p>
//           <p>5. Create a new password for your account.</p>

//           <p>Please note that this OTP is valid for one-time use only and will expire in 10 minutes. If you did not request this password reset, please ignore this email. </p>
//           <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:">Support@team</a>.</p>
//           <p>Best regards,</p>
//           <p>The Verification Team</p>
//         </div>
//       </body>`

//         }

//         transporter.sendMail(mailOptions, async (err, success) => {

//             if (err) {

//                 res.status(404).send({ "message": "Email is wrong" })

//             } else {


//                 verifyEmail = Email

//                 verifypassword = Password



//                 res.send({ "message": "OTP has sent" })
//             }
//         })

//     } else {

//         res.status(404).send({ "message": "We have no data about Your email, Please First register" })
//     }

// }


/** ################################################################### */
/*************************************   Reset Password  ************************** */
// const ResetPassword = async (req, res) => {

//     let { OTP } = req.body



//     if (Number(OTP) == otp.OneTimePassword && verifyEmail !== undefined && verifypassword !== undefined) {
//         try {

//             bcrypt.hash(verifypassword, 8, async (err, hash) => {

//                 await User.updateOne({ Email: verifyEmail }, { Password: hash })

//                 let mailOptions = {

//                     from: "bluearpon4567@gmail.com",
//                     to: verifyEmail,
//                     subject: "Your Password Has Been Updated Successfully",
//                     html: `<body>
//                 <div style="font-family: Arial, sans-serif; font-size: 17px; color: #000000;">
//                   <p>Dear, Admin</p>
//                   <p>I am writing to inform you that your password has been updated successfully. As part of our ongoing commitment to security, we encourage our clients to change their passwords regularly, and we are pleased to let you know that this update has been completed successfully.</p>
//                   <p>Your new password is: <strong style="color:red;">${verifypassword}</strong>. Please ensure that you keep this password safe and secure. If you have any difficulties or concerns regarding your new password, please do not hesitate to get in touch with us and we will be happy to assist you.</p>
//                   <p>We take the security of your account seriously and have implemented a number of measures to ensure that your information remains safe. We use advanced encryption technology to protect your data, and our team regularly monitors our systems to identify and prevent any potential security breaches.</p>
//                   <p>Thank you for choosing us as your provider of Blue Apron. If you have any questions or feedback, please do not hesitate to get in touch with us.</p>
//                   <p>Best regards,</p>
//                   <p>The Verification Team</p>
//                 </div>
//               </body>`

//                 }

//                 transporter.sendMail(mailOptions, async (err, success) => {

//                     if (err) {

//                         res.status(404).send({ "message": "Email is wrong" })

//                     }
//                 })

//                 res.send({ "message": "Details Updated" })

//             })

//         } catch (err) {

//             res.send({ "message": err.message })
//         }

//     } else {

//         res.status(400).send({ "message": "OTP is Wrong, Please try again" })

//     }

// }

/** Delete News */
const getNews = async (req, res) => {
    const { NoOfNews, Page } = req.query

    try {

        let total = await News.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }, { $project: { _id: 0, total: 1, totalPages: { $ceil: { $divide: ["$total", Number(NoOfNews)] } } } }])

        // Send the retrieved news items as a response

        if (total[0]["totalPages"] < Number(Page)) {
            res.status(404).send({ msg: `there is no ${Page} Page` })
        } else {
    
            let data = await News.aggregate([{$sort:{CreatedOn:-1}},{ $skip: (Number(Page) - 1) * Number(NoOfNews) }, { $limit: Number(NoOfNews) }])
            console.log(data.length)
            res.send({ data })
        }



    } catch (error) {
        // If an error occurs during the database operation, send an error response
        res.status(500).send({ message: 'Error fetching news items from the database' });
    }
};



/**************************************delete document by _id******************************************************** */
const deleteNews = async (req, res) => {
    const { _id, uuid } = req.query;

    try {
        /************************************** here also should delete S3 Object, also have to implement that function************************************************/

        

     
        // Find the document by its _id and delete it
        const deletedDocument = await News.findOneAndDelete({UUID:uuid});
        // console.log(deletedDocument)
        if (!deletedDocument) {
            return res.status(404).json({ message: "Document not found." });
        }

        return res.status(200).json({ message: "Document deleted successfully.", deletedDocument });
    } catch (error) {
        console.error("Error deleting document:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



const UpdateNews = async (req, res) => {
    const { uuid } = req.query;
    const updates = req.body;

    try {
        // Check if a new file is uploaded
        if (req.file) {
            const UUID = uuidv4(); // Generate a new unique ID if a new image is uploaded
            const fileBuffer = req.file.buffer;
            const folderPath = Path.join('Blog_Images');

            // Create folder if it doesn't exist
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Define new image file name and path
            const fileName = `${UUID}${req.file.originalname}`;
            const filePath = Path.join(folderPath, fileName);

            // Save the new image file
            fs.writeFileSync(filePath, fileBuffer);

            // Add the new image URL to the updates object
            updates.ImageURL = `https://gautamsolar.us/admin/blogImage/${fileName}`;
        }

        // Update document in the News collection
        const updatedDocument = await News.findOneAndUpdate({ UUID: uuid }, updates, { new: true });
        
        if (!updatedDocument) {
            return res.status(404).json({ message: "Document not found." });
        }

        res.status(200).json({ message: "News updated successfully", updatedDocument });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getNewsByUUID = async (req, res) => {
    const { uuid } = req.body;

    try {
        // Find the document by its UUID
        const newsItem = await News.findOne({ UUID: uuid });

        // If no document is found, return a 404 error
        if (!newsItem) {
            return res.status(404).json({ message: "News item not found." });
        }

        // Send the found document as the response
        res.status(200).json({ message: "News item fetched successfully", data: newsItem });
    } catch (error) {
        console.error("Error fetching news item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {  create, getNews, deleteNews, UpdateNews, GetBlogImage,getNewsByUUID }
