const TechnologiesService = require('../../entities/services/technologies.js')
const Repository = require('../../entities/repositories/repository.js')
const model = require('../../entities/models/technologies.js')
const error = require('../../fns/error.js')
const projectsTechsService = require('./ProjectsTechnologies.js')


const repository = new Repository(model, error)

const tecnologyService = new TechnologiesService(repository, error, projectsTechsService)

module.exports = tecnologyService