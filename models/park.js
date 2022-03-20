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
		npsId: { type: String },
		images: { type: String },
		description: { type: String },
		activities: { type: String },
		directionsInfo: { type: String },
		directionsUrl: { type: String },
		//adding default zero would create the visit if no
		//data was available...
		visit: { type: Number, min: 0, default: 0 },
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