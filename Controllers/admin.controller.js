
const { News } = require('../Models/News.Schema')
const { User } = require('../Models/admin.schema')
//const JWT = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
//const bcrypt = require('bcrypt')
//const nodemailer = require('nodemailer')
const Path = require('path');
const fs = require('fs')
require('dotenv').config()



const generateSitemap = async () => {
    try {
        const blogs = await News.find();
        const sitemapLinks = blogs.map(blog => ({
            url: `/${createSlug(blog.Header)}`,
            lastmod: new Date(blog.CreatedOn).toISOString().split('T')[0]  // format YYYY-MM-DD
        }));

        const { SitemapStream, streamToPromise } = require('sitemap');
        const { Readable } = require('stream');
        
        const stream = new SitemapStream({ hostname: 'https://gautamsolar.com' });

        // Generate the sitemap XML and save it to a file
        const xmlData = await streamToPromise(Readable.from(sitemapLinks).pipe(stream));
        fs.writeFileSync(Path.join(__dirname, 'sitemap.xml'), xmlData);
        console.log('Sitemap generated and saved');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
};

// Function to create URL slugs
const createSlug = (header) => {
    return header
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Remove consecutive hyphens
        .trim();
};





/** ################################################################### */
const create = async (req, res) => {
    /** making file in Blog_Images folder */
    try {
        const UUID = req.body.UUID || uuidv4(); // Use provided UUID or generate a new one
        const { Header, Description, Body, tags } = req.body;
        // console.log(req.body);
        console.log(req.files);


        /** Get the file buffer and the file forma , because file is store in buffer data **/
        const fileBuffer = req.files?.buffer;
        // console.log(fileBuffer)

        let videoFileName;
        let imageFileName;
        if (req.files?.BlogImage) {
            /** Define the folder path **/
            const folderPath = Path.join('Blog_Images');


            /** Create the folder if it doesn't exist **/
            if (!fs.existsSync(folderPath)) {
                console.log(folderPath);
                fs.mkdirSync(folderPath, { recursive: true });
            }

            /** Define the file path, including the desired file name and format */
            imageFileName = `${req.files?.BlogImage[0]?.filename}`;
            const filePath = Path.join(folderPath, imageFileName);

            /** Save the file buffer to the specified file path */
            if (fileBuffer) {
                fs.writeFileSync(filePath, fileBuffer);
            }
        }


        // for checking we have video or not
        if (req.files?.BlogVideo) {
            // video folder
            const folderPath1 = Path.join('Blog_Video');
            /** Create the folder if it doesn't exist **/
            if (!fs.existsSync(folderPath1)) {
                console.log(folderPath1);
                fs.mkdirSync(folderPath1, { recursive: true });
            }

            /** Define the file path, including the desired file name and format */
            videoFileName = `${req.files?.BlogVideo[0]?.filename}`;
            const filePath1 = Path.join(folderPath1, videoFileName);

            /** Save the file buffer to the specified file path */
            if (fileBuffer) {

                fs.writeFileSync(filePath1, fileBuffer);
            }

        }

        const videofilePath = videoFileName ? `https://gautamsolar.us/admin/blogVideo/${videoFileName}` : null;

        const imagefilePath = imageFileName ? `https://gautamsolar.us/admin/blogImage/${imageFileName}` : null;


        /** Prepare data for insertion or update */
        const data = {
            UUID: UUID,
            ImageURL: imagefilePath,
            VideoUrl: videofilePath,
            Header: Header,
            Description: Description,
            Body: Body,
            Tags: tags
        };

        await generateSitemap();
        /** Check if document with UUID exists */
        const existingDocument = await News.findOne({ UUID });

        if (existingDocument) {
            // Update the existing document
            await News.updateOne({ UUID }, { $set: data });

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Data inserted successfully!",
                    data: {
                        insertedData,
                        ImageURL: data.ImageURL,
                        VideoUrl: data.VideoUrl
                    }
                });
        } else {
            // Insert a new document
            let insertedData = await News.insertMany(data);
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Data inserted successfully!",
                    data: {
                        insertedData,
                        ImageURL: data.ImageURL,
                        VideoUrl: data.VideoUrl
                    }
                });

        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong..",
            error: err,
        });
    }

};




/** Get Blog Image */
const GetBlogImage = async (req, res) => {
    const filename = req.params?.filename;
    /** Define the absolute path to the IPQC-Pdf-Folder directory */
    const pdfFolderPath = Path.resolve('Blog_Images');

    /** Construct the full file path to the requested file */
    const filePath = Path.join(pdfFolderPath, filename);

    if (fs.existsSync(filePath)) {
       return res.sendFile(filePath);
    } else {
       return res.status(404).send({
            success: false,
            message: 'File not found',
        });
    }
}
//get blog Video
const GetBlogVideo = (req, res) => {
    const filename = req.params?.filename;
    const pdfFolderPath = Path.resolve('Blog_Video');
    const filePath = Path.join(pdfFolderPath, filename);
    
    if (fs.existsSync(filePath)) {
       return res.sendFile(filePath);
    } else {
       return res.status(404).send({ 
            success:false,
            message: 'File not found',
         });
    }


}

/** ################################################################### */


/** Delete News */
const getNews = async (req, res) => {
    const { NoOfNews, Page } = req.query

    try {
        // here News is a collection
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
        const deletedDocument = await News.findOneAndDelete({ UUID: uuid });
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
        if (req.files) {
            // const UUID = uuidv4(); // Generate a new unique ID if a new image is uploaded
            const fileBuffer = req.files?.buffer;
            const folderPath = Path.join('Blog_Images');

            // Create folder if it doesn't exist
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Define new image file name and path
            const fileName = `${req.files?.filename}`;
            const filePath = Path.join(folderPath, fileName);

            // Save the new image file
            fs.writeFileSync(filePath, fileBuffer);

            // Add the new image URL to the updates object
            updates.ImageURL = `https://gautamsolar.us/admin/blogImage/${fileName}`;

            const folderPath1 = Path.join('Blog_video');
            if (!fs.existsSync(folderPath1)) {
                fs.mkdirSync(folderPath1, { recursive: true });
            }
            //define the new video
            const fileName1 = `${req.files?.filename}`;
            const filePath1 = Path.join(folderPath1, fileName1)

            // Save the new video file
            fs.writeFileSync(filePath1, fileBuffer)
            updates.VideoUrl = `https://gautamsolar.us/admin/blogVideo/${fileName1}`;
        }



        // Update document in the News collection
        const updatedDocument = await News.findOneAndUpdate({ UUID: uuid }, updates, { new: true });

        if (!updatedDocument) {
            return res.status(404).json({ message: "Document not found." });
        }

        res.status(200).json({ message: "News updated successfully", updatedDocument });


        await generateSitemap();
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



module.exports = { create, getNews, deleteNews, UpdateNews, GetBlogImage, getNewsByUUID, GetBlogVideo }
