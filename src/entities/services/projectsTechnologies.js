const transaction = require("../../tests/testTransaction");

class ProjectsTechnologiesService {
  constructor(repository, error, model) {
    this.repository = repository,
    this.error = error,
    this.model = model
  }

  async findAllWith(params ) {
    const itens = await this.repository.findAllWith(params )

    return itens
  }

  async create(project, technologies, transaction) {
    if(!project.id) {
      throw this.error(1, "missingProject", "not found project")
    }

    
    const projectsTechnologiesData = []
    
    technologies.forEach(tech => {
      const item = {
        projectId: project.id,
        technologyId: tech
      }
      projectsTechnologiesData.push(item)
    });
      
    return await this.repository.bulkCreate(
      projectsTechnologiesData,
      transaction
    );
  }

  async update(project, technologies, transaction) {
    return project.setTechnologies(technologies, transaction)

  }


async delete(params,transaction ) {
  await this.repository.deleteAllWith(this.model, params, transaction)
}
}

module.exports = ProjectsTechnologiesService;
