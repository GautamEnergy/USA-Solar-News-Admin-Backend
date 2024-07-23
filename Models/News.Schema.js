const mongoose = require('mongoose')
const TagSchema = mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, { _id: false });
const NewsSchema = mongoose.Schema({
    UUID:{
      type:String,
      required:true
    },
    ImageURL: {
        type: String,
        required: true,
        trim: true, // Trim whitespac
    },
    Tags: [TagSchema],
    Header: {
        type: String,
        required: true
    },
    Body: {
        type: String,
        required: true
    },
    CreatedOn: {
        type: Date,
        default: Date.now, 
        immutable: true 
    },
    UpdatedOn: {
        type: Date,
        required: false
    },
    CreatedBy: {
        type: String,
        required: false
    },
    UpdatedBy: {
        type: String,
        required: false
    }
}, {
    versionKey: false
})

const News = mongoose.model('New', NewsSchema)

module.exports = { News }