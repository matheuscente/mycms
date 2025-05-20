const UserController = require('../../entities/controllers/user.js')
const userService = require('../services/user.js')


const userController = new UserController(
    userService
);

module.exports = userController