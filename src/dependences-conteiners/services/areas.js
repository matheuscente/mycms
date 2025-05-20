const AreaService = require('../../entities/services/areas.js')
const Repository = require('../../entities/repositories/repository.js')
const model = require('../../entities/models/areas.js')
const error = require('../../fns/error.js')
const serviceProjects = require('./projects.js') 


const repository = new Repository(model, error)

const areaService = new AreaService(repository, error, serviceProjects)

module.exports = areaService