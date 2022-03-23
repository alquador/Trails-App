process.env.NODE_ENV = 'test'


const chai = require('chai')
const expect = chai.expect
const assert = require('assert')
const UserRouter = require('./controllers/auth')
const User = require("./models/user")
const HomeRouter = require('./controllers/home')
const ParksRouter = require('./controllers/park')
const CommentRouter = require('./controllers/comment')

describe('/controllers/park', () => {
    it('should hit the park route', () => {
        //actual test content in here
    })
})