const database = require('../../database.js')

class ModelProjectsTechnologies {
    constructor() {
        this.model = database.db.define('projectsTechnology', {

            projectId: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true
                
            },

            technologyId: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true
                
            }
        })
    }
}

module.exports = new ModelProjectsTechnologies().model