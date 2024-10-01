const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    sender: {
        type: [String],
        required: true
    },
    message: {
        type: [String],
        default: [],
        required: true
    },
    date: {
        type: [Date],
        default: []
    },
    url: {
        photourl: {
            type: [String],
            default: []
        },
        videourl: {
            type: [String],
            default: []
        },
        videolink: {
            type: [String],
            default: []
        },
        otherLink: {
            type: [String],
            default: []
        }
    },
    likedby: {
        type: [[String]],
        default: [[]]
    },
    commentor : {
        type : [[String]] ,
        default : [[]]
    } ,
    comments: {
        type: [[String]],
        default: [[]]
    },
    friends: {
        type: [String],
        default: []
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;