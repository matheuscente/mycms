const transaction = require("../../tests/testTransaction");

class ProjectsController {
  constructor(service, database, error) {
    this.error = error;
    this.database = database;
    this.service = service;
  }
  async findAll(req, res, next) {
    try {
      const projects = await this.service.findAll();

      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.service.findOne(id );

      res.status(200).json(project);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, year, inProgress, technologies, area, url } =
        req.body;

      const project = await this.service.create(
        title,
        description,
        year,
        inProgress,
        technologies,
        area,
        url,
        req.transaction
      );
      await req.transaction.commit()
      res.status(201).json({ project: await this.service.findOne(project.id) });
      next();
    } catch (error) {
      next(error);
    }
  }

  
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, inProgress, area, technologies, year } = req.body;

      const project = await this.service.findOne(id, req.transaction);

      if(!project) {
        throw this.error(1, 'missingProject', `not found projects in id ${id}`)
      }

      const updateProjectsFields = {
        title: title || project.title,
        description: description || project.description,
        inProgress: inProgress === true || inProgress === false ? inProgress : project.inProgress,
        areaId: area || project.area.id,
        technologies: technologies || project.technologies.map((tech) => {
          return tech.id
        }),
        year: year || project.year
      }


      await this.service.update(
        project,
        updateProjectsFields,
        req.transaction
      );
      await req.transaction.commit()

        res.status(200).json({ project: await this.service.findOne(project.id) });

    } catch (error) {
      
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.service.findOne(id, req.transaction);

      if(!project) {
        throw this.error(1, 'missingProject', `not found projects in id ${id}`)
      }


      const deletedProject = await this.service.delete(
        project,
        
      );
      await req.transaction.commit()
      res.status(200).json({ deletedProject });
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectsController;
