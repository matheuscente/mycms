const {Sequelize} = require("sequelize")
require("dotenv").config({ path: "./config.env" });

class DataBase {
    constructor() {
        this.init();
    }

    init() {
        this.db = new Sequelize({
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorization: false
                }
            }
        })
    }
}

module.exports = new DataBase()