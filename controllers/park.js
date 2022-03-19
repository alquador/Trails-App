// Import Dependencies
const express = require('express')
const Park = require('../models/park')
require("dotenv").config()
const axios = require('axios')
//import fetch from "node-fetch"
// Create router
const router = express.Router()
const fetch = require('node-fetch')
const { json } = require('express/lib/response')
 //Router Middleware
//Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
// router.use((req, res, next) => {
// 	// checking the loggedIn boolean of our session
// 	if (req.session.loggedIn) {
// 		// if they're logged in, go to the next thing(thats the controller)
// 		next()
// 	} else {
// 		// if they're not logged in, send them to the login page
// 		res.redirect('/auth/login')
// 	}
// })

//const requestUrl = `https://developer.nps.gov/api/v1/parks?stateCode=co&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
const reqUrlFront = 'https://developer.nps.gov/api/v1/parks'
const reqUrlApiKey = '&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6'
let defaultState = '?stateCode=co'
let selectedPark = ''
const exampleUrl = `${reqUrlFront}${selectedPark}${reqUrlApiKey}`


// Routes

// INDEX PAGE FOR ALL PARKS
//this route is displaying the query result from the user entering a state code
router.get('/', (req, res) => {
	//console.log('this is the example URL', exampleUrl)
	let stateCode = req.query.stateCode
	let fullName
	console.log(stateCode)
	console.log('after state code')
	const requestUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
	//console.log(requestUrl)
    //find the parks
	axios.get(requestUrl)
    //then render a template AFTER they're found
		.then(responseData => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			//console.log(parks)
			//const parksTest = { fullName: 'TEST', description: 'TESTDATA'}
			//res.render('parks/index', { parks, username, loggedIn, parksTest })
			//res.send('test')
			//console.log('first .then', responseData)
			return responseData	
		})
		.then(jsonData => {
			//console.log(jsonData.data.data[0].fullName)
			fullName = jsonData.data.data
			//console.log('second .then')
			res.render('parks/index', { parks: fullName })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows the user's saved favorite parks
//Maybe I need a GET route that links to my database....
//saves or POSTs to /parks/mine route...
router.get('/mine', (req, res) => {
	const parkId = req.params.parkId
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	console.log(req.session)
	console.log(userId)
	Park.find({ owner: userId })
		.then((parks) => {
			console.log(parks)
			res.render('parks/mine', { parks, parkId, username, userId, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//This is the POST route that logs the selected "favorite park" from user in the db
//this stems from the action of the hidden form on the show page
router.post('/', (req, res) => {
    // destructure user info from req.session
	//parkId = req.body.parkId
	console.log('this is the req.body.parkId', req.body.parkId)
    const { username, userId, loggedIn } = req.session
	Park.create({ 
		fullName: req.body.name, 
		images: req.body.image,
		owner: userId,
		description: req.body.description,
		visit: 0
	    })
		.then((park) => {
			console.log('THIS IS THE CREATED PARK: ', park)
			//redirecting back to the park show page
			res.redirect(`/parks/${req.body.parkId}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//UPDATE route-sends a put request to our database
//Add a visit to the my parks page
router.put('/:id', (req, res) => {
    //get the id
    const parkId = req.params.id
    //tell mongoose to update the product
    //$subtract qty: 1 did not work! deletes it
    Park.findByIdAndUpdate(parkId, { $inc: {visit: 1} })
    //now there needs to be a conditional statement
    .then(park => {
        console.log('the updated visits', park)
        res.redirect(`/parks/mine`)
    })
    //if an error, display that
    .catch(err => res.json(err))
    
})

// SHOW route
//this route displays all of the parks from the particular state code
router.get('/:id', (req, res) => {
	let fullName
	//console.log('this is the example URL', exampleUrl)
	let images
	let activities
	let entranceFees
	const parkId = req.params.id
	const requestUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkId}&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
	axios.get(requestUrl)
		.then(responseData => {
			return responseData	
		})
		//Park.findById(parkId)
		.then(jsonData => {
			const park = jsonData.data.data[0]
			//console.log('this is the park', jsonData.data)
			let activities = jsonData.data.data.activities
			let images = jsonData.data.data[0].images[0].url
			let entranceFees = jsonData.data.data[0].entranceFees
			//console.log('ENTRANCE FEES', entranceFees)
			//console.log(Park.find({}))
			console.log(typeof parkId)
			res.render('parks/show', { park: park, parkId})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
// DELETE route of specifically added park in the user's favorites page
//delete route withing parks/mine....
router.delete(('/:id'), (req, res) => {
	const parkId = req.params.id
	Park.findByIdAndRemove(parkId)
		.then((park) => {
            console.log('this is the response, delete route', park)
			res.redirect('/parks/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router

// router.get('/:id', (req, res) => {
// 	let fullName
// 	console.log('this is the example URL', exampleUrl)
// 	let images
// 	let activities
// 	let entranceFees
// 	const parkId = req.params.id
// 	const requestUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkId}&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
// 	axios.get(requestUrl)
// 		.then(responseData => {
// 			//const username = req.session.username
// 			//const loggedIn = req.session.loggedIn
// 			//console.log(parks)
// 			//const parksTest = { fullName: 'TEST', description: 'TESTDATA'}
// 			//res.render('parks/index', { parks, username, loggedIn, parksTest })
// 			//res.send('test')
// 			//console.log('first .then', responseData)
// 			return responseData	
// 		})
// 		//Park.findById(parkId)
// 		.then(jsonData => {
// 			const park = jsonData.data.data[0]
// 			//console.log('EVERYTHING', parkId.)
// 			//console.log('this is the parkId', parkId)
// 			//console.log(jsonData.data.data[0].fullName)
// 			//console.log(jsonData.data.data[0].images)
// 			//parks = jsonData.data.data
// 			console.log('this is the park', jsonData.data)
// 			//console.log('THESE ARE THE PARKS DATA:', parks)
// 			//console.log('trying to access data of a specific park:', parks.parkId)
// 			//console.log('these are the parks', parks)
// 			let activities = jsonData.data.data.activities
// 			//console.log(jsonData.data.data[0].activities[0].name)-pulls up one, I need to grab all of them
// 			//console.log(JSON.parse(jsonData.data.data.activities.name))
// 			//console.log('This is the image for a specific park:', jsonData.data.data[0].images[0].url)
// 			let images = jsonData.data.data[0].images[0].url
// 			let entranceFees = jsonData.data.data[0].entranceFees
// 			console.log('ENTRANCE FEES', entranceFees)
// 			//console.log('second .then')
// 			//console.log(Park.find({}))
// 			res.render('parks/show', { park: park})
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// //use this to put the comment here...
// // update route
// router.put('/mine/:id/comments', (req, res) => {
// 	const parkId = req.params.id
// 	req.body.ready = req.body.ready === 'on' ? true : false

// 	Park.findByIdAndUpdate(parkId, req.body, { new: true })
// 		.then((park) => {
// 			res.redirect(`/parks/${park.id}`)
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })