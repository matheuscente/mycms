const error = require("../../fns/error.js");
const Repository = require("../../entities/repositories/repository.js");
const crypto = require("./crypto.js");
const sessionModel = require('../../entities/models/session.js')
const ServiceSession = require('../../entities/services/session.js')
const userService = require('./user.js')


const sessionRepository = new Repository(sessionModel, error);

const sessionService = new ServiceSession(
  sessionRepository,
  crypto,
  error,
  userService
);

module.exports = sessionService