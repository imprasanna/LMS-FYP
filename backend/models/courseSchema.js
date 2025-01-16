const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },

    isPublished: {
        type: Boolean,
        default: false,
    },
    videos:[
        {
            videoTitle: {
                type: String,
                required: true,
            },
            videoUrl: {
                type: String,
                required: true,
            },
        }
    ]
});

module.exports = mongoose.model('course', courseSchema);