
let salt = process.env.BCRYPT_SALTS
salt = Number.parseInt(salt)

class ServiceUser {
  constructor(repository, error, crypto) {
    this.repository = repository;
    this.security = crypto;
    this.error = error;
  }
  async findAll() {

    const users = await this.repository.findAll();

    return users
  }

  async findOne(id) {
    const user = await this.repository.findOne({id});
    
    return user
  }

  async findOneWithSensibleFields(params) {
  
    const user = await this.repository.findOneWithSensibleFields(
      params
    );
    
    return user
  }

  async create(data, transaction) {
    const {name, userName, password, role } = data;


    const hashedPass = await this.security.hash(password, salt);

    if (!(role === "admin" || role === "guest")) {
      throw this.error(2, 'permissionDenied', 'invalid role');
    }

    const user = await this.repository.create(
      {
        name,
        userName,
        password: hashedPass,
        role,
      },
      transaction
    );

    
    return this.findOne(user.id, transaction)
  } 

  async update(user, field, value, transaction) {
    if(!user.id) {
        throw this.error(1, 'missingUser', 'not found user in provided id')
      } if (field === 'password') {
        const hashedPass = await this.security.hash(value, salt)
        const updatedUser = await this.repository.update(user, field, hashedPass, transaction)
        const returnUptateUser = {...updatedUser.dataValues}
        delete returnUptateUser.password
        return returnUptateUser

      }
      return  this.repository.update(user, field, value, transaction)

}

async updateRole(user, newRole, transaction) {
  if(!user.id) {
    throw this.error(1, 'missingUser', `not found user in provided id`)
  } else if(!(newRole === "guest" || newRole === "admin")) {
    throw this.error(2, 'permissionDenied', `invalid role`)
  }
  return this.repository.update(user, 'role', newRole, transaction)
}

  async delete(user, transaction) {
    return await this.repository.delete(user, transaction);
  }



  async verify(id, role) {
    if(!id) {
      throw this.error(2, 'permissionDenied', `not found user`)
    } else if(!role) {
      throw this.error(2, 'permissionDenied', `role invalid or not provided`)
    }
    return await this.repository.findOne({ id, role });
  }
}

module.exports = ServiceUser