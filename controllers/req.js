const notificationDB = require('../model/Notification')
const PostDB = require('../model/Post')

exports.req = async (req, res) => {
    try {
        console.log('inside req')
        const { sender, recipient } = req.body;

        console.log(sender, recipient)

        if (!sender || !recipient) {
            return res.json('Sender or recipient not defined or null')
        }

        const sendernotifications = await notificationDB.findOne({ username: recipient })

        sendernotifications.friendReq.push(sender)
        await sendernotifications.save();

        return res.status(200).json('Request Sent')
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}

exports.checkFriends = async (req, res) => {
    try {
        const { sender, recipient } = req.body;

        if (!sender || !recipient) {
            return res.json('Sender or recipient not defined or null')
        }

        const recipientdb = await PostDB.findOne({ username: recipient })
        const Friends = recipientdb.friends;

        for (const temp of Friends) {
            if (temp == sender) {
                return res.json(true)
            }
        }

        return res.status(200).json(false)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}

exports.noOfFriends = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const friendss = await PostDB.findOne({ username: correctUN });

        return res.status(200).json(friendss.friends)
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.posts = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const msgs = await PostDB.findOne({ username: correctUN });

        const selfmsgs = [];
        const selfdates = [];

        for (let i = 0; i < msgs.message.length; i++) {
            if (msgs.sender[i] == correctUN) {
                selfmsgs.push(msgs.message[i]);
                selfdates.push(msgs.date[i]);
            }
        }

        return res.status(200).json({ messages: selfmsgs, dates: selfdates });
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}

exports.findFollowing = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const allusers = await PostDB.find();
        let following = [];

        for (const user of allusers) {
            if (user.username == correctUN) continue;
            for (const friend of user.friends) {
                if(friend == correctUN) {
                    following.push(user.username);
                    break;
                }
            }
        }
        return res.status(200).json(following);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}