const database = require("../../database.js");

class User {
  constructor() {
    this.model = database.db.define("user", {
      id: {
        type: database.db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },

      userName: { 
        type: database.db.Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: database.db.Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      withSensibleFields: {
      }
    }
    },
  );
  }
}

module.exports = new User().model;