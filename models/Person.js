const mongoose = require('mongoose');
const { Schema } = mongoose;

// Validators
const validateEmail = require("../validators/email-validator");

// Creating a new Schema for Person
const PersonSchema = new Schema({
  // Here, we set the names of properties
  name: {
    type: String,
    required: 'Person\'s name is required'
  },
  position: {
    type: String,
    required: 'Person\'s position is required'
  },
  // Unique and have patterns
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  address: {
    type: String
  },
  // Need to save countryCode and phoneNumber
  phone: {
    countryCode: {
      type: Number,
      required: 'Regional code for phone number is required.'
    },
    number: {
      type: Number,
      required: 'Phone number is required.'
    }
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  // One-to-many
  projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
  }],
  skills: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

// Here, we export the model of persons
module.exports = mongoose.model('persons', PersonSchema);
