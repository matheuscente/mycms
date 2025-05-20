class ServiceAreas {
  constructor(repository, error, serviceProjects) {
    this.repository = repository, 
    this.error = error;
    this.serviceProjects = serviceProjects
  }
  async findAll() {
    const areas = await this.repository.findAll();
    return areas;
  }

  async findOne(id) {
    const area = await this.repository.findOne({id} );

    return area;
  }

  async create(title, description, transaction) {
    const area = await this.repository.create(
      { title, description },
      transaction
    );

    return area;
  }

  async update(area, title, description, transaction) {

    return this.repository.update(area, {title, description}, transaction);
  }

  async delete(area, transaction) {
    const projectsWithArea = await this.serviceProjects.findAllWith({areaId: area.id}, transaction)
    if(projectsWithArea.length >= 1) {
      throw this.error(1, 'invalidAction', 'cannot delete area because has a project who use it')
    } else {
      return this.repository.delete(area, transaction)
    }
  }

}

module.exports = ServiceAreas;
