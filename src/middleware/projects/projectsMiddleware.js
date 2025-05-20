const error = require("../../fns/error.js");
const areaService = require("../../dependences-conteiners/services/areas.js");
const projectsService = require('../../dependences-conteiners/services/projects.js')
const technologiesMiddleware = require('../technologies/technologiesMiddleware.js')

class ProjectsMiddleware {


  async updateProjects(req, res, next) {

    const { field } = req.body;
    const { id } = req.params
    
    const project = await projectsService.findOne(id, req.transaction)
    if(!project) {
      next(error(1, "missingProject", `not found projects in id ${id}`));
        return;
    }
    if (field === "area") {
      const { value } = req.body;

      const areaInBD = await areaService.findOne(value, req.transaction);
      if (!areaInBD) {
        next(error(1, "missingArea", `not found areas in id ${area}`));
        return;
      }

    } else if (field === "technologies") {
      const {value} = req.body
      const isTechsInBD = await technologiesMiddleware.isTechsInBD(value, req.transaction);

      if (!isTechsInBD) {
        next(error(1, "missingTech", `an informed technology was not found`));
        return;
      }
    }
    next()
    return
  }


  async createProject(req, res, next) {
    const { technologies } = req.body;
    const { area } = req.body;

    const areaInBD = await areaService.findOne(area, req.transaction);
    if (!areaInBD) {
      next(error(1, "missingArea", `not found areas in id ${area}`));
      return;
    }

    const isTechsInBD = await technologiesMiddleware.isTechsInBD(technologies, req.transaction);

    if (!isTechsInBD) {
      next(error(1, "missingTech", `an informed technology was not found`));
      return;
    } else {
      next();
    }
  }

}

module.exports = new ProjectsMiddleware();
