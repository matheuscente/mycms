const SessionController = require('../../entities/controllers/session.js')
const sessionService = require('../services/session.js')
const security = require('../../dependences-conteiners/services/crypto.js')
const userService = require('../services/user.js')


const sessionController = new SessionController(
    sessionService,
    security,
    userService
);

module.exports = sessionController