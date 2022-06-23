const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creating a new Schema for Project
const ProjectSchema = new Schema({
  // Here, we set the names of properties
  title: {
    // The type
    type: String,
    // And if is required or not
    required: true
  },
  status: {
    type: String
  },
  country: {
    type: String
  },
  clientName: {
    type: String
  },
  description: {
    type: String
  },
  technologies: {
    type: Array
  },
});

// Here, we export the model of Projects
module.exports = mongoose.model('projects', ProjectSchema);
