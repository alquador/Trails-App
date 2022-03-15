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
    const parkId = req.params.fruitId
    console.log('first comment body', req.body)
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the fruit with the fruitId
    Park.findById(parkId)
        .then(park => {
            // then we'll send req.body to the comments array
            park.comments.push(req.body)
            // save the fruit
            return park.save()
        })
        .then(park => {
            // redirect
            res.redirect(`/parks/${park.id}`)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy a comment
// we'll use two params to make our life easier
// first the id of the fruit, since we need to find it
// then the id of the comment, since we want to delete it
router.delete('/delete/:parkId/:commId', (req, res) => {
    // first we want to parse out our ids
    const fruitId = req.params.fruitId
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
            // redirect to the fruit show page
            res.redirect(`/parks/${parkId}`)
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