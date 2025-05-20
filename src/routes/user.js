const express = require("express");
const controller = require('../dependences-conteiners/controllers/user.js')
const authMiddleware = require('../middleware/auth/auth.js')
const validationMiddleware = require('../middleware/global/middleware.js')


const route = express.Router();

// adm options
route.get("/admin", authMiddleware.auth('admin'), controller.findAll.bind(controller));

route.get("/admin/:id", authMiddleware.auth('admin'), validationMiddleware.dataValidator('idSchema', 'params'), controller.findOne.bind(controller));

route.post("/admin",    authMiddleware.auth("admin").bind(authMiddleware), validationMiddleware.dataValidator('createUserSchema', 'body'), controller.create.bind(controller));

route.put("/admin/:id",     authMiddleware.auth('admin'), validationMiddleware.dataValidator('idSchema', 'params'), validationMiddleware.dataValidator('updateUserSchema', 'body'), controller.update.bind(controller));

route.delete("/admin/:id",     authMiddleware.auth('admin'), validationMiddleware.dataValidator('idSchema', 'params'), controller.delete.bind(controller));

route.put("/admin/:id",     authMiddleware.auth('admin').bind(authMiddleware),  validationMiddleware.dataValidator('idSchema', 'params'), authMiddleware.auth('admin'), controller.updateRole.bind(controller))

//user options
route.put("/update",    authMiddleware.auth(), validationMiddleware.dataValidator('updateUserSchema', 'body'), controller.update);
route.get("/info",authMiddleware.auth(), controller.findOne.bind(controller));


module.exports = route;