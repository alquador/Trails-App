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



//router.post('/:stateCode', (req, res) => {
    //let stateCode = req.body.stateCode
    //console.log(stateCode)
    //res.redirect('/parks')
//})


////////////////////////////////////////////
// Export Router
////////////////////////////////////////////
module.exports = router