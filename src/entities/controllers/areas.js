class AreasController {
    constructor(service, database, error) {
      this.database = database
      this.service = service
      this.error = error
    }
    async findAll(req, res, next) {
      
      try {
        const areas = await this.service.findAll();

        res.status(200).json(areas);

      } catch (error) {
        
        next(error);
      }
    }
  
    async findOne(req, res, next) {
      
      try {
        
        const { id } = req.params;
        const area = await this.service.findOne(id);
        
        res.status(200).json(area);

      } catch (error) {
        
        next(error);
      }
    }

    async create(req, res, next) {
       
      try {
            const {title, description} = req.body
            const area = await this.service.create(title, description, req.transaction)
            await req.transaction.commit()
            res.status(201).json({area})
            next()
        }catch(error) {
            
            next(error);
        }
    }
  
    async update(req, res, next) {
      
      try {
        
        const { id } = req.params;
        const { title, description } = req.body;

        const area = await this.service.findOne(id);

        if(!area) {
          throw this.error(1, 'missingArea', `not found areas in id ${id}`)
        }

        
    const newTitle = title || area.title
    const newDescription = description || area.description


        const newarea = await this.service.update(
          area,
          newTitle,
          newDescription,
          req.transaction
          
        );
        await req.transaction.commit()
        res.status(200).json({ newarea });
        next()
      } catch (error) {
        
        next(error);
      }
    }
  
    async delete(req, res, next) {
      
      try {
        
        const { id } = req.params;
        
        const area = await this.service.findOne(id, req.transaction);


        if(!area) {
          throw this.error(1, 'missingArea', `not found areas in id ${id}`)
        }
        const deletedarea = await this.service.delete(
          area,
          
        );
        await req.transaction.commit()
        res.status(200).json({ deletedarea });
        next()
      } catch (error) {
        
        next(error);
      }
    }
  }
  
  module.exports = AreasController;
  