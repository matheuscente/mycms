class ServiceTechnologies {
  constructor(repository, error, projectsTechnologiesService) {
    this.repository = repository,
    this.error = error;
    this.projectsTechnologiesService = projectsTechnologiesService
  }
  async findAll() {
    const technologies = await this.repository.findAll();
    return technologies;
  }

  async findOne(id) {
    const technology = await this.repository.findOne({id});

    return technology;
  }

  async create(title, description, transaction) {
    const technology = await this.repository.create(
      { title, description },
      transaction
    );

    return technology;
  }

  async update(technology, title, description,transaction) {
    return this.repository.update(technology, {title, description},transaction );
  }

  async delete(technology, transaction) {
    const hasRelationship = await this.projectsTechnologiesService.findAllWith({technologyId: technology.id}, transaction)
    
    if(hasRelationship.length >= 1) {
        throw this.error(1,'invalidAction', 'cannot delete technology because has a project who use it')
    } else {
      return this.repository.delete(technology, transaction);

    }
  }
}

module.exports = ServiceTechnologies;
