const {Schema, model} = require("mongoose");

// Validators
const validateEmail = require("../validators/email-validator");

const User = model(
    "User",
    new Schema({
        username: {
            type: String,
            required: 'Username is required'
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: 'Password is required'
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);
module.exports = User;
