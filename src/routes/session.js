const express = require("express");
const controller = require('../dependences-conteiners/controllers/session.js')
const authMiddleware = require('../middleware/auth/auth.js')
const middleware = require('../middleware/global/middleware.js')

const route = express.Router()


route.post("/logout",    authMiddleware.auth().bind(authMiddleware), middleware.dataValidator('logoutSchema', 'body').bind(middleware), authMiddleware.auth(), controller.logout.bind(controller))

route.put("/newJwt", authMiddleware.authNewJwt(), controller.getNewJwt.bind(controller))

module.exports = route;