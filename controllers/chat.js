const PostDB = require('../model/Post');
const ChatDB = require('../model/chatRooms')

exports.loadProfiles = async (req, res) => {
    try {
        const profiles = await PostDB.find();

        const usernames = []

        for (const un of profiles) {
            usernames.push(un.username)
        }

        return res.status(200).json(usernames);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Interval Server Error');
    }
}

exports.loadChat = async (req, res) => {
    try {
        const { correctUN, chatWith } = req.body;

        let chatRoom = await ChatDB.findOne({
            $or: [
                { username1: correctUN, username2: chatWith },
                { username1: chatWith, username2: correctUN }
            ]
        }).exec();

        if (!chatRoom) {
            // If no chat room exists, create a new one with default values for required fields
            chatRoom = new ChatDB({
                username1: correctUN,
                username2: chatWith,
                msgf1to2: [],   // Initialize empty arrays for required fields
                msgf2to1: [],
                datef1to2: [],
                datef2to1: []
            });

            await chatRoom.save();
        }

        let no;

        if (chatRoom.username1 == correctUN && chatRoom.username2 == chatWith) {
            no = 1;
        } else {
            no = 2;
        }

        return res.status(200).json({ chatRoom, no });
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
};

exports.sendmsg = async (req, res) => {
    try {
        const { correctUN, chatWith, message } = req.body; // sender -> correctUN , sending to -> chatWith

        let chatRoom = await ChatDB.findOne({
            $or: [
                { username1: correctUN, username2: chatWith },
                { username1: chatWith, username2: correctUN }
            ]
        }).exec();

        let no;

        if (chatRoom.username1 == correctUN && chatRoom.username2 == chatWith) {
            no = 1;
        } else {
            no = 2;
        }

        const nowd = new Date();

        if (no == 1) {
            chatRoom.msgf1to2.push(message);
            chatRoom.datef1to2.push(nowd);
        } else {
            chatRoom.msgf2to1.push(message);
            chatRoom.datef2to1.push(nowd);
        }

        await chatRoom.save();

        return res.status(200).json('Message Delivered');
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}