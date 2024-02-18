const mongoose = require('mongoose')
const uniqueValidator =require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
        minLength: 3
    }
})

userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // Password shouldn't be returned
        // delete returnedObject.hashedPassword
    }
})


// We could also implement other validations into the user creation.
//  We could check that the username is long enough, that the username only consists of permitted characters,
//  or that the password is strong enough. Implementing these functionalities is left as an optional exercise.

const User = mongoose.model('User', userSchema)

module.exports = User
