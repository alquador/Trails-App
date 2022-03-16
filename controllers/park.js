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


router.post('/:stateCode', (req, res) => {
	//console.log('this is the example URL', exampleUrl)
    let stateCode = req.body.stateCode
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
			return responseData	
		})
		.then(jsonData => {
			res.redirect('/parks')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's examples
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

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('parks/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Park.create(req.body)
		.then((park) => {
			console.log('this was returned from create', park)
			res.redirect('/parks')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const parkId = req.params.id
	Park.findById(parkId)
		.then((park) => {
			res.render('parks/edit', { park, username, loggedIn })
		})
		.catch((error) => {
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
	const parkId = req.params.id
	
	const requestUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkId}&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
	axios.get(requestUrl)
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
		//Park.findById(parkId)
		.then(jsonData => {
			const park = jsonData.data.data[0]
			//console.log('EVERYTHING', parkId.)
			//console.log('this is the parkId', parkId)
			//console.log(jsonData.data.data[0].fullName)
			//console.log(jsonData.data.data[0].images)
			//parks = jsonData.data.data
			console.log('this is the park', jsonData.data)
			//console.log('THESE ARE THE PARKS DATA:', parks)
			//console.log('trying to access data of a specific park:', parks.parkId)
			//console.log('these are the parks', parks)
			let activities = jsonData.data.data.activities
			//console.log(jsonData.data.data[0].activities[0].name)-pulls up one, I need to grab all of them
			//console.log(JSON.parse(jsonData.data.data.activities.name))
			//console.log('This is the image for a specific park:', jsonData.data.data[0].images[0].url)
			let images = jsonData.data.data[0].images[0].url
			//console.log('second .then')
			res.render('parks/show', { park: park})
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