////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')

// we need our Fruit MODEL because comments are ONLY a schema
// so we'll run queries on fruits, and add in comments
const Park = require('../models/park')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// only need two routes for comments right now
// POST -> to create a comment
router.post('/:parkId', (req, res) => {
    const parkId = req.params.parkId
    //const parkId = Park.findById(req.params.parkId)
    //JSON.stringify(parkId)
    //console.log('IS THIS A VALID OBJECT ID:', mongoose.Types.ObjectId.isValid('2B14155F-0E31-43F3-8B87-8B1DA6FA0BF7'))
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the park by the parkId
    //find one by id and then if it doesn't exist create it
    //then push comment into the comments array
    //input field for the add comment form has a name of "note"!
    Park.findById(parkId)
        .then(park => {
            // then we'll send req.body to the comments array
            park.comments.push(req.body)
            console.log('THIS IS THE COMMENT THAT WAS PUSHED:', req.body)
            // save the user comment
            return park.save()
        })
        .then(park => {
            // redirect
            console.log('LAST .THEN park.id', park)
            res.redirect('/parks/mine')
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy a comment
// we'll use two params to make our life easier
// first the id of the park, since we need to find it
// then the id of the comment, since we want to delete it
router.delete('/delete/:parkId/:commId', (req, res) => {
    // first we want to parse out our ids
    const parkId = req.params.parkId
    const commId = req.params.commId
    // then we'll find the fruit
    Park.findById(parkId)
        .then(park => {
            const theComment = park.comments.id(commId)
            // only delete the comment if the user who is logged in is the comment's author
            if ( theComment.author == req.session.userId) {
                // then we'll delete the comment
                theComment.remove()
                // return the saved fruit
                return park.save()
            } else {
                return
            }

        })
        .then(park => {
            // redirect to the user's favorites page
            res.redirect('/parks/mine')
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router