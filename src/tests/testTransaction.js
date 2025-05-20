const database = require('../database.js')

const transaction = database.db.transaction()

module.exports = transaction