const techModel = require('../models/technologies.js')
const areaModel = require('../models/areas.js');
const database = require('../../database.js');
const { updateFields } = require('../../validations/validation.js');


class ServiceProjects {
  constructor(repository, techService, projectsTechService, projectsAreasService, error) {
    this.repository = repository;
    this.techService = techService;
    this.projectsTechService = projectsTechService;
    this.error = error
    this.projectsAreasService = projectsAreasService

  }

  async findAllWith(params ) {
    const projects = await this.repository.findAllWith(params)
    return projects
  }

  async findAll() {
    const projects = await this.repository.findAll();
    return projects;
  }

  async findOne(id ) {
    const project = await this.repository.findOne({id});

    return project;
  }

  async create(
    title,
    description,
    year,
    inProgress,
    technologies,
    area,
    url,
    transaction
  ) {

    const project = await this.repository.create(
      { title,
        description,
        year,
        inProgress,
        areaId: area,
      url },
        transaction
    );

    await this.projectsTechService.create(
      project,
      technologies,
      transaction
    );
    return project;
  }

  async update(project, updateFields, transaction) {

      await project.setTechnologies(updateFields.technologies, transaction)
      
      delete updateFields.technologies
    
      return await this.repository.update(project, updateFields,transaction );

  }

  async delete(project, transaction) {
    await this.projectsTechService.delete({projectId: project.id}, transaction)
    return this.repository.delete(project, transaction);
  }
}

module.exports = ServiceProjects;
