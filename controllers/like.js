const PostDB = require('../model/Post')
const notificationDB = require('../model/Notification')

exports.like = async (req, res) => {
    try {
        const { correctUN, sender, message } = req.body;

        const post = await PostDB.findOne({ username: sender });

        const messageIndex = post.message.findIndex((msg) => msg === message);

        if (!post.likedby[messageIndex]) {
            post.likedby[messageIndex] = [];
        }

        if (!post.likedby[messageIndex].includes(correctUN)) {
            post.likedby[messageIndex].push(correctUN);

            let senderNotifications = await notificationDB.findOne({ username: sender });
            senderNotifications.likes.push(`Your post: ${message} was liked by ${correctUN}`);

            await senderNotifications.save();
            await post.save();
        }

        return res.status(200).json(post.likedby[messageIndex]);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
};

exports.loadlikes = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const likes = await notificationDB.findOne({ username: correctUN });

        return res.status(200).json(likes.likes);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.loadcomments = async (req, res) => {
    try {
        const { correctUN } = req.body;

        const comments = await notificationDB.findOne({ username: correctUN });

        return res.status(200).json(comments.comments);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.comment = async (req, res) => {
    try {
        const { correctUN, sender, message, comment } = req.body;

        const post = await PostDB.findOne({ username: sender });
        const messageIndex = post.message.findIndex((msg) => msg === message);

        if (!post.comments[messageIndex]) {
            post.comments[messageIndex] = [];
        }
        if (!post.commentor[messageIndex]) {
            post.commentor[messageIndex] = [];
        }

        post.comments[messageIndex].push(comment);
        post.commentor[messageIndex].push(correctUN);

        let senderNotifications = await notificationDB.findOne({ username: sender });
        senderNotifications.comments.push(`${correctUN} commented ${comment} on your post ${message}`);

        await senderNotifications.save();
        await post.save();

        return res.status(200).json(senderNotifications.comments);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.checklike = async (req, res) => {
    try {
        const { correctUN, sender, message } = req.body;

        const senderpostdb = await PostDB.findOne({ username: sender });

        const msgs = senderpostdb.message;
        let i;

        for (i = 0; i < msgs.length; i++) {
            if (msgs[i] == message) {
                break;
            }
        }

        const likes = senderpostdb.likedby[i];

        if (!likes) {
            return res.status(200).json(false);
        }

        for (const temp of likes) {
            if (temp == correctUN) {
                return res.status(200).json(true)
            }
        }

        return res.status(200).json(false);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.unlike = async (req, res) => {
    try {
        const { correctUN, sender, message } = req.body;

        const senderPosts = await PostDB.findOne({ username: sender });

        const i = senderPosts.message.findIndex((msg) => msg == message);

        senderPosts.likedby[i].pull(correctUN);
        await senderPosts.save();

        return res.status(200).json(senderPosts.likedby[i])
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error');
    }
}

exports.showlikes = async (req, res) => {
    try {
        const { sender, message } = req.body;

        const senderPosts = await PostDB.findOne({ username: sender });

        const messageIndex = senderPosts.message.findIndex((msg) => msg == message);

        return res.status(200).json(senderPosts.likedby[messageIndex]);
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}

exports.showcomments = async (req, res) => {
    try {
        const { sender, message } = req.body;

        const senderPosts = await PostDB.findOne({ username: sender });

        const messageIndex = senderPosts.message.findIndex((msg) => msg == message);

        return res.status(200).json({
            commentor: senderPosts.commentor[messageIndex],
            comment: senderPosts.comments[messageIndex]
        });        
    } catch (err) {
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}