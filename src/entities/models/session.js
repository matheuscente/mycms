const modelUser = require("./user.js");
const database = require("../../database.js");

class Session {
  constructor() {
    this.model = database.db.define(
      "Session",
      {
        id: {
          type: database.db.Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        jwt: {
          type: database.db.Sequelize.STRING,
          unique: true,
        },

        refreshToken: {
          type: database.db.Sequelize.STRING,
          unique: true,
          allowNull: false,
        },

        userId: {
          type: database.db.Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: modelUser,
            key: "id",
          },
        }
      },
      {
        defaultScope: {
            attributes: {
                exclude: ['refreshToken', 'userId']
            },
            include: [{ model: modelUser,
                        attributes: {
                            exclude: ['password']
                        }
             }],
        },
        scopes: {
            withSensibleFields: {}
        }
      }
    );
  }
}

module.exports = new Session().model;