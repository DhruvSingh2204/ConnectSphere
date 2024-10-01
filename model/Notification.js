const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    username : {
        type : String ,
        required : true
    } ,
    friendReq : {
        type : [String] ,
        default : []
    } ,
    likes : {
        type : [String] ,
        default : []
    } ,
    comments : {
        type : [String] ,
        default : []
    }
})

const Notification = mongoose.model('Notification' , notificationSchema)

module.exports = Notification;