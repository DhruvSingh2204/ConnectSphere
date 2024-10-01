const notificationDB = require('../model/Notification')
const PostDB = require('../model/Post')

exports.load = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const notifications = await notificationDB.findOne({username : correctUN});

        return res.status(200).json(notifications)
    } catch(err) {
        console.log(err)
        return res.status(500).json('Internal server error')
    }
}

exports.accept = async (req, res) => {
    try {
        const { sender, recipient } = req.body;

        const senderr = await PostDB.findOne({ username: sender });

        if (!senderr) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        senderr.friends.push(recipient);

        await senderr.save();

        console.log('Recipient friends ->', senderr.friends);

        const notifications = await notificationDB.findOne({ username: sender });

        if (!notifications) {
            return res.status(404).json({ error: 'Sender notifications not found' });
        }

        notifications.friendReq.pull(recipient);
        await notifications.save();

        console.log('Current friend requests ->', notifications.friendReq);

        return res.status(200).json('Friend Request Accepted');
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal server error');
    }
};

exports.decline = async (req , res) => {
    try {
        const {sender , recipient} = req.body;

        console.log(sender , recipient)

        const notifications = await notificationDB.findOne({ username: sender });

        if (!notifications) {
            return res.status(404).json({ error: 'Sender notifications not found' });
        }

        notifications.friendReq.pull(recipient);
        await notifications.save();

        console.log('Current friend requests ->', notifications.friendReq);

        return res.status(200).json('Friend Request Declined')
    } catch(err) {
        console.log(err)
        return res.status(500).json('Internal server error')
    }
}