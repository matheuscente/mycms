const database = require('../../database.js')

class ModelTechnologies {
    constructor() {
        this.model = database.db.define('technology', {
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

module.exports = new ModelTechnologies().model