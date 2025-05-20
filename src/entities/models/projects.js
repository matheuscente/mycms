const database = require('../../database.js')
const technologyModel = require('./technologies.js')
const areaModel = require('./areas.js')


class ModelProjects {
    constructor() {
        this.model = database.db.define('project', {
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
            },
            year: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false
            },

            areaId: {
                type: database.db.Sequelize.INTEGER,
                allowNull: false
            },
            url: {
                type: database.db.Sequelize.STRING,
                allowNull: false
            },

            inProgress: {
                type: database.db.Sequelize.BOOLEAN,
                allowNull: false
            }
        },
        {
            defaultScope: {
                include: [
                    {model: technologyModel},
                    {model: areaModel}
                ]
                
            }
        }

        )


    }
}

module.exports = new ModelProjects().model