// import dependencies
const mongoose = require('./connection')

// we also need to import our commentSchema
const commentSchema = require('./comment')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const parkSchema = new Schema(
	{
		fullName: { type: String, required: true },
		images: { type: String, required: true },
		description: { type: String, required: true },
		activities: { type: String, required: true },
		entranceFees: { type: Number, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		comments: [commentSchema]
	},
	{ timestamps: true }
)

const Park = model('Park', parkSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Park