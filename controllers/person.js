const User = require('../model/User');
const PostDB = require('../model/Post')

exports.persons = async (req, res) => {
    try {
        const people = await User.find();

        console.log(people)

        return res.status(200).json(people);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

exports.person = async(req , res) => {
    try {
        const {correctUN , friendToBeFound} = req.body;

        const person = await User.findOne({username : friendToBeFound})

        if(!person) {
            return res.json('Person Not Found')
        }

        return res.status(200).json(person)
    } catch(err) {
        console.log(err)
        return res.status(500).json({ message: 'An error occurred' });
    }
}