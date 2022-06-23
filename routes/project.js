const express = require("express");
const router = express.Router();

const Project = require("../models/Project");

// @Route   GET api/project/
// @desc    Get all projects
// @access  Public
router.get("/", (req, res) => {
  // Sending html in response with message
  // res.send('Hello from projects');

  // Query all documents in db
  Project.find()
    .then((projects) => {
      // Returning documents to client
      return res.json(projects);
    })
    .catch((error) => {
      // Error handling
      return res.status(500).json(error);
    });
});

// @Route   POST api/project/new
// @desc    Creating a new project
// @access  Public
router.post("/", (req, res) => {
  // Get name and age from body request
  const { title, status, country, clientName, description, technologies } =
    req.body;

  // Creating a new project (Model)
  const newProject = new Project({
    title,
    status,
    country,
    clientName,
    description,
    technologies,
  });

  // Saving the new project in the db
  newProject
    .save()
    .then((project) => res.json(project))
    .catch((error) => res.status(500).json(error));
});

// @Route   PUT api/project/update/:id
// @desc    Update a project
// @access  Public
router.put("/:id", (req, res) => {
  const { title, status, country, clientName, description, technologies } =
    req.body;
  Project.findOneAndUpdate(
    { _id: { $eq: req.params.id } }, // Find one id equals to id in params
    { title, status, country, clientName, description, technologies }, // data to be updated
    { new: true } // to mongoose returns the updated document
  )
    .then((newProject) => {
      return res.json(newProject);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

// @Route   DELETE api/project/:id
// @desc    Delete a project
// @access  Public
router.delete("/:id", (req, res) => {
  // Searching for a project and deleting
  Project.findOneAndDelete({ _id: req.params.id })
    .then((project) => {
      // If the id of project not exists, returns a error
      if (!project) {
        res.status(404).json({ msg: "There is no user for this ID" });
      }

      return res.json(project);
    })
    .catch((error) => {
      // Handling the error
      return res.status(500).json(error);
    });
});

// Export the routes of project
module.exports = router;
