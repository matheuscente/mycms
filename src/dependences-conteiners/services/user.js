const error = require("../../fns/error.js");
const repository = require("../../entities/repositories/repository.js");
const crypto = require("./crypto.js");
const userModel = require('../../entities/models/user.js')
const ServiceUser = require('../../entities/services/user.js')


const repositoryUser = new repository(userModel, error);

const serviceUser = new ServiceUser(
  repositoryUser,
  error,
  crypto
);

module.exports = serviceUser