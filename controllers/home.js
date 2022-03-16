////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const axios = require('axios')
////////////////////////////////////////////
// Create Router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Route
////////////////////////////////////////////
//const requestUrl = `https://developer.nps.gov/api/v1/parks?stateCode=co&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6`
const reqUrlFront = 'https://developer.nps.gov/api/v1/parks'
const reqUrlApiKey = '&api_key=3OP6Ah2wdAocReevQiT5VXL3YK37IiLrNaFlEUw6'
let defaultState = '?stateCode=co'
let selectedPark = ''
const exampleUrl = `${reqUrlFront}${selectedPark}${reqUrlApiKey}`

router.get('/', (req, res) => {
    res.render('layout.liquid')
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

//router.post('/:stateCode', (req, res) => {
    //let stateCode = req.body.stateCode
    //console.log(stateCode)
    //res.redirect('/parks')
//})


////////////////////////////////////////////
// Export Router
////////////////////////////////////////////
module.exports = router