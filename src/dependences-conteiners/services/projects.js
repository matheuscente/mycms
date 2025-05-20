const ProjectsService = require('../../entities/services/projects.js')
const Repository = require('../../entities/repositories/repository.js')
const model = require('../../entities/models/projects.js')
const technologiesService = require('./technologies.js')
const projectsTechService = require('./ProjectsTechnologies.js')
const error = require('../../fns/error.js')


const repository = new Repository(model, error)

const projectService = new ProjectsService(repository, technologiesService, projectsTechService, error)

module.exports = projectService