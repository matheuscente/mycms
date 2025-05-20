const express = require("express");
const controller = require("../dependences-conteiners/controllers/projects.js");
const middleware = require("../middleware/global/middleware.js");
const ProjectsMiddleware = require('../middleware/projects/projectsMiddleware.js');
const projectsMiddleware = require("../middleware/projects/projectsMiddleware.js");
const authMiddleware = require('../middleware/auth/auth.js')


const route = express.Router();

route.get("/", controller.findAll.bind(controller));

route.get("/:id", authMiddleware.auth().bind(authMiddleware), middleware.dataValidator('idSchema', 'params'),  controller.findOne.bind(controller));

route.post("/",     authMiddleware.auth('admin').bind(authMiddleware), middleware.dataValidator("createProjectsSchema", "body"), ProjectsMiddleware.createProject.bind(ProjectsMiddleware),  controller.create.bind(controller));

route.put("/:id",     authMiddleware.auth('admin').bind(authMiddleware), middleware.dataValidator('idSchema', 'params'), middleware.dataValidator('updateProjectSchema', 'body'), projectsMiddleware.updateProjects.bind(projectsMiddleware) , controller.update.bind(controller));

route.delete("/:id",     authMiddleware.auth('admin').bind(authMiddleware), middleware.dataValidator('idSchema', 'params'), controller.delete.bind(controller));

module.exports = route;
