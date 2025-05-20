const technologiesService = require('../services/technologies.js')
const TechnologiesController = require('../../entities/controllers/technologies.js')
const database = require('../../database.js')
const error = require('../../fns/error.js')


const technologiesController = new TechnologiesController(technologiesService, database, error)

module.exports = technologiesController