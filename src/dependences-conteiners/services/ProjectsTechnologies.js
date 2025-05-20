const ProjectsTechnologies = require('../../entities/services/projectsTechnologies.js')
const Repository = require('../../entities/repositories/repository.js')
const model = require('../../entities/models/projectsTechnologies.js')
const error = require('../../fns/error.js')


const repository = new Repository(model, error)

const ProjectsTechnologiesService = new ProjectsTechnologies(repository, error, model)

module.exports = ProjectsTechnologiesService