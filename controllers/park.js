// Import Dependencies
const express = require('express')
const Park = require('../models/park')
require("dotenv").config()
const axios = require('axios')
//import fetch from "node-fetch"
// Create router
const router = express.Router()
const fetch = require('node-fetch')
// Router Middleware
// Authorization middleware
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

// Routes

// index ALL
router.get('/', (req, res) => {
	let fullName
	const stateCode = 'co'
	console.log(stateCode)
	console.log('after state code')
	const requestUrl = `https://developer.nps.gov/api/v1/parks?stateCode=md&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
	//const requestUrl2 = 'https://3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6@developer.nps.gov/api/v1/parks?parkCode=acad'
	console.log(requestUrl)
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
			console.log('first .then', responseData)
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
	const parkId = req.params.id
	Park.findById(parkId)
		.then((park) => {
            const {username, loggedIn, userId} = req.session
			res.render('parks/show', { park, username, loggedIn, userId })
		})
		.catch((error) => {
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