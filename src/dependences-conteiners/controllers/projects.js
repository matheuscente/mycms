const projectsService = require("../services/projects.js");
const ProjectsController = require("../../entities/controllers/projects.js");
const database = require('../../database.js')
const error = require('../../fns/error.js')


const projectsController = new ProjectsController(projectsService, database, error);

module.exports = projectsController;
