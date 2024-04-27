const mongoose = require('mongoose')
const NewsSchema = mongoose.Schema({
    UUID:{
      type:String,
      required:true
    },
    ImageURL: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
        validate: {
            validator: function(v) {
                // Validate URL format
                return /^(http?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
            },
            message: props => `${props.value} is not a valid URL`
        }
    },
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