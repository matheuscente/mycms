const tokenModule = require("jsonwebtoken");
const hashModule = require("bcrypt");
const error = require("../../fns/error.js");
const Crypto = require('../../entities/services/crypto.js')
const key = process.env.JWT_KEY
const crypto  = require('crypto')

const security = new Crypto(
    tokenModule,
    hashModule,
    error,
    key,
    crypto
  );
  
  module.exports = security