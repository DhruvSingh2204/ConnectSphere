const express = require('express')
const PostDB = require('../model/Post')

exports.loadmain = async (req , res) => {
    try {
        const {correctUN} = req.body;

        if(!correctUN) {
            return res.json('Please Login/SignUp first')
        }

        const response = await PostDB.findOne({username : correctUN});

        return res.status(200).json(response)
    } catch(err) {
        console.log(err)
    }
}