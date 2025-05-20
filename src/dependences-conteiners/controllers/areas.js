const areasService = require('../services/areas.js')
const AreasController = require('../../entities/controllers/areas.js')
const database = require('../../database.js')
const error = require('../../fns/error.js')


const areasController = new AreasController(areasService, database, error)

module.exports = areasController