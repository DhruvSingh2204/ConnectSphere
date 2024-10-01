const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../model/User')
const PostDB = require('../model/Post')
const notificationDB = require('../model/Notification')

exports.login = async (req , res) => {
    const {userName , password} = req.body;

    try {
        const foundUser = await User.findOne({username : userName})

        if(!foundUser) {
            res.json({'message' : `User - ${userName} not found , Kindly sign up first`})
            return `${userName} not found`
        }

        const pwdMatch = await bcrypt.compare(password , foundUser.password);

        if(!pwdMatch) {
            res.json({'message' : `Incorrect UserName or Password`})
            return 'Incorrect UserName or Password'
        }

        console.log(`${userName} Logged In!!`)

        return res.status(200).json({
            'message': `User ${foundUser.username} logged in!`,
            'user': {
                id: foundUser._id,
                userName: foundUser.username,
                email: foundUser.email,
            }
        });
    } catch(err) {
        console.log(err)
        return res.status(500).json({'message' : `Internal Server Error`})
    }
}

exports.signUp = async (req , res) => {
    const {userName , password , email} = req.body;

    console.log('inside signUp function')

    try {
        const foundUser = await User.findOne({ username: userName });

        if(foundUser) {
            res.json({ 'message': `Duplicate userName, try another userName` });
            return 'Duplicate Username';
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: userName, 
            password: hashedPwd,
            email: email
        });

        const newUserForPost = await PostDB.create({
            username: userName
        });

        newUserForPost.friends.push(userName);

        // Save the updated document to persist the changes
        await newUserForPost.save();

        const newUserNotifications = await notificationDB.create({
            username: userName
        });

        console.log(newUser);

        return res.status(200).json({
            'message': `New User - ${newUser.username} created`,
            'user': {
                id: newUser._id,
                userName: newUser.username,
                email: newUser.email,
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 'message': `Internal Server Error` });
    }
}