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

// index ALL
router.get('/', (req, res) => {
	//console.log('this is the example URL', exampleUrl)
	let stateCode = req.query.stateCode
	let fullName
	console.log(stateCode)
	console.log('after state code')
	const requestUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
	//const requestUrl2 = 'https://3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6@developer.nps.gov/api/v1/parks?parkCode=acad'
	//console.log(requestUrl)
    //find the parks
	axios.get(requestUrl)
    //then render a template AFTER they're found
		.then(responseData => {
			//const username = req.session.username
			//const loggedIn = req.session.loggedIn
			//console.log(parks)
			//const parksTest = { fullName: 'TEST', description: 'TESTDATA'}
			//res.render('parks/index', { parks, username, loggedIn, parksTest })
			//res.send('test')
			//console.log('first .then', responseData)
			return responseData	
		})
		.then(jsonData => {
			console.log(jsonData.data.data[0].fullName)
			fullName = jsonData.data.data
			console.log('second .then')
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
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Park.find({ owner: userId })
		.then((parks) => {
			res.render('parks/index', { parks, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const parkId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Park.findByIdAndUpdate(parkId, req.body, { new: true })
		.then((park) => {
			res.redirect(`/parks/${park.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	let fullName
	console.log('this is the example URL', exampleUrl)
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
			console.log('this is the park', jsonData.data)
			let activities = jsonData.data.data.activities
			let images = jsonData.data.data[0].images[0].url
			let entranceFees = jsonData.data.data[0].entranceFees
			console.log('ENTRANCE FEES', entranceFees)
			//console.log(Park.find({}))
			res.render('parks/show', { park: park})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
router.post('/', (req, res) => {
    // destructure user info from req.session
    //const { username, userId, loggedIn } = req.session
	Park.create({ fullName: req.body.name })
		.then((park) => {
			console.log('this is the park', park)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const parkId = req.params.id
	Park.findByIdAndRemove(parkId)
		.then((park) => {
            console.log('this is the response, delete route', park)
			res.redirect('/parks')
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