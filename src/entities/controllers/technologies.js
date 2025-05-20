class TechnologiesController {
    constructor(service, database, error) {
      this.error = error
      this.database = database
      this.service = service
    }
    async findAll(req, res, next) {
      
      try {
        const technologies = await this.service.findAll();
        res.status(200).json(technologies);

      } catch (error) {
        next(error);
      }
    }
  
    async findOne(req, res, next) {
      
      try {
        const { id } = req.params;
        const technology = await this.service.findOne(id );
        
        res.status(200).json(technology);

      } catch (error) {
        
        next(error);
      }
    }

    async create(req, res, next) {
       
      try {
            const {title, description} = req.body
            const technology = await this.service.create(title, description, req.transaction)
            await req.transaction.commit()
            res.status(201).json({technology})
            next()
        }catch(error) {
            
            next(error);
        }
    }
  
    async update(req, res, next) {
      
      try {
        
        const { id } = req.params;
        const { title, description } = req.body;
        const technology = await this.service.findOne(id, req.transaction);

        if(!technology) {
          throw this.error(1, 'missingTech', `not found technologies in id ${id}`)
        }

    const newTitle = title || technology.title
    const newDescription = description || technology.description

        const newTechnology = await this.service.update(
          technology,
          newTitle,
          newDescription,
          req.transaction
          
        );
        await req.transaction.commit()
        res.status(200).json({ technology: newTechnology });
        next()
      } catch (error) {
        
        next(error);
      }
    }
  
    async delete(req, res, next) {
      
      try {
        
        const { id } = req.params;
        const technology = await this.service.findOne(id, req.transaction);

        if(!technology) {
          throw this.error(1, 'missingTech', `not found technologies in id ${id}`)
        }
        
        const deletedTechnology = await this.service.delete(
          technology,
          
        );
        await req.transaction.commit()
        res.status(200).json({ deletedTechnology });
        next()
      } catch (error) {
        
        next(error);
      }
    }
  }
  
  module.exports = TechnologiesController;
  