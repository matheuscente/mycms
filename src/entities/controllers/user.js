

class ApiUser {
  constructor(service) {
    this.service = service
  }
  async findAll(req, res, next) {
    try {
      const users = await this.service.findAll();
      res.status(200).json(users);
      next()
    } catch (error) {
      next(err)
      return
    }
  }

  async findOne(req, res, next) {
    try {
      let id = req.params.id 
      if(req.route.path === "/info") {
        id = req.session.id
      }
      const user = await this.service.findOne(id);
      res.status(200).json(user);
    } catch (err) {
      next(err)
      return
    }
  }

  async create(req, res, next) {
    try {
      const { name, userName, password, role } = req.body;
      const user = await this.service.create({
        name,
        userName,
        password,
        role}
      );
      res.status(201).json({ created: user });
      await req.transaction.commit()
      next()
    } catch (err) {
      next(err)
      return
    }
  }

  async update(req, res, next) {
    try {
      let id = req.params.id || req.session.id
      const { field, value } = req.body;
      const user = await this.service.findOne(id)
      const updatedUser = await this.service.update(user, field, value);
      await req.transaction.commit()
      res.status(201).json({ updatedUser });
      return
    } catch (err) {
      next(err)
      return
    }
  }

  async updateRole(req, res, next) {
    try{
      const {id} = req.params
      const newRole = req.body.role
      const user = await this.service.findOne(id)
      const updatedUser = await this.service.updateRole(user, newRole)
      await req.transaction.commit()
      res.status(201).json({updatedUser})
      next()
    } catch(err) {
     next(err)
     return
    }
  }

  async delete(req, res, next) {
    try {
      const {id} = req.params
      const user = await this.service.findOne(id) 
      const deletedUser = await this.service.delete(user);
      await req.transaction.commit()
      res.status(201).json({ deletedUser });
      next()
    } catch (err) {
      next(err)
      return
    }
  }


}

module.exports = ApiUser;