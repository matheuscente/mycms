const database = require('../../database.js')

class ModelArea {
    constructor() {
        this.model = database.db.define('area', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: database.db.Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            description: {
                type: database.db.Sequelize.STRING
            }
            
        })

       
    }
}

module.exports = new ModelArea().model