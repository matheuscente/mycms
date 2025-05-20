class RepositoryUser {
  constructor(model, error) {
    this.model = model;
    this.error = error
  }

  async findOneWithSensibleFields(whereParams) {
    return this.model
      .scope("withSensibleFields")
      .findOne({ where: whereParams  });
  }

  async findAllWithSensibleFields() {
    return this.model
      .scope("withSensibleFields")
      .findAll({});
  }

  async findAll() {
    return this.model.findAll({ });
  }

  async findAllWith(whereParams) {
    return this.model.findAll({where: whereParams })
  }

  async findOneWith(whereParams) {
    return this.model.findOne({where: whereParams })
  }

  async findOne(whereParams) {
    return this.model.findOne({ where: whereParams  });
  }

  async create(data, transaction) {
    try {
      const dataCreated = await this.model.create(data, { transaction });
      return dataCreated
    } catch (err) {
      console.log(err)
      if(err.name === 'SequelizeUniqueConstraintError') {
        const fieldWithError = err.errors[0].path
        throw this.error(1,'uniqueViolation', `please send a new ${fieldWithError} for ${this.model.tableName}`)
      } else if(err.errors[0].type === 'notNull Violation') {
        const fieldWithError = err.errors[0].path
        throw this.error(1,'nullViolation', `set a ${fieldWithError} value for  ${this.model.tableName}`)
      } else {
        console.log(err)
        throw this.error(4, 'internalError', "an internal error was ocurred")
      }
      
    }
  }

  async bulkCreate(projectsTechnologiesData,transaction) {
    return this.model.bulkCreate(projectsTechnologiesData, {transaction})
  }

  async update(entity, updateFields, transaction) {
    try {
    for(const field in updateFields) {
       entity[field] = updateFields[field]
    }
    const upadate = await entity.save({ transaction });
    return upadate
    } catch (err) {
      console.log(err)
        if(err.name === 'SequelizeUniqueConstraintError') {
        const fieldWithError = err.errors[0].path
        throw this.error(1,'uniqueViolation', `please send a new ${fieldWithError} for ${this.model.tableName}`)
      } else if(err.errors[0].type === 'notNull Violation') {
        const fieldWithError = err.errors[0].path
        throw this.error(1,'nullViolation', `set a ${fieldWithError} value f
          or ${this.model.tableName}`)
      } else {
        console.log(err)
        throw this.error(4, 'internalError', "an internal error was ocurred")
      }
      
    }
  }

  async delete(entity, transaction) {
    return entity.destroy({ transaction });
  }

  async deleteAllWith(model, whereParams, transaction) {
    
    return model.destroy({where: whereParams,  transaction });
  }
}

module.exports = RepositoryUser;
