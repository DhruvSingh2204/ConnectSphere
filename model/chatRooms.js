const mongoose = require('mongoose');
const { Schema } = mongoose;

const rooms = new Schema({
    username1: {
        type: String,
        required: true
    },
    username2: {
        type: String,
        required: true
    },
    msgf1to2: {
        type: [String],
        required: true
    },
    msgf2to1: {
        type: [String],
        required: true
    },
    datef1to2: {
        type: [Date],
        required: true
    },
    datef2to1: {
        type: [Date],
        required: true
    }
});

const chatRooms = mongoose.model('chatRooms', rooms);

module.exports = chatRooms;