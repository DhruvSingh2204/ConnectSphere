const PostDB = require('../model/Post');

// Controller for posting article
exports.postArticle = async (req, res) => {
    try {
        const { correctUN, editorText, videoLink } = req.body;
        
        // Find user in the PostDB by username
        const Friends = await PostDB.findOne({ username: correctUN });

        if (!Friends) {
            return res.status(404).json({ message: 'User not found' });
        }

        let shareImage = null;
        let shareVideo = null;

        // Handle file uploads (shareImage and shareVideo)
        if (req.files) {
            if (req.files['shareImage']) {
                shareImage = req.files['shareImage'][0].filename;
            }
            if (req.files['shareVideo']) {
                shareVideo = req.files['shareVideo'][0].filename;
            }
        }

        const currentDate = new Date();

        // Iterate over friends and update their PostDB entries
        for (const friendUsername of Friends.friends) {
            const person = await PostDB.findOne({ username: friendUsername });

            if (person) {
                // Add editorText, videoLink, image, and video to friend's post fields
                person.message.push(editorText);
                person.url.videolink.push(videoLink);
                person.url.photourl.push(shareImage ? shareImage : null);
                person.url.videourl.push(shareVideo ? shareVideo : null);
                person.sender.push(correctUN);
                person.date.push(currentDate);

                await person.save(); // Save changes to database
            }
        }

        return res.status(200).json({ message: 'Article Posted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred' });
    }
};