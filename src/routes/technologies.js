const express = require("express");
const controller = require("../dependences-conteiners/controllers/technologies.js")
const middleware = require('../middleware/global/middleware.js');
const authMiddleware = require("../middleware/auth/auth.js");


const route = express.Router();

route.get("/", authMiddleware.auth().bind(authMiddleware), controller.findAll.bind(controller));


route.get("/:id", authMiddleware.auth().bind(authMiddleware),  middleware.dataValidator('idSchema', 'params'), middleware.dataValidator('idSchema', 'params'), controller.findOne.bind(controller));


route.post("/",     authMiddleware.auth('admin').bind(authMiddleware),  middleware.dataValidator('createTechAndAreaSchema', 'body'), controller.create.bind(controller));


route.put("/:id",     authMiddleware.auth('admin').bind(authMiddleware), middleware.dataValidator('idSchema', 'params'), middleware.dataValidator('updateTechAndAreaSchema', 'body'), controller.update.bind(controller));


route.delete("/:id",     authMiddleware.auth('admin').bind(authMiddleware),  middleware.dataValidator('idSchema', 'params'), controller.delete.bind(controller));

module.exports = route;