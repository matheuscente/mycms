
class Crypto {
    constructor(tokenModule, hashModule, error, key, crypto) {
      this.tokenModule = tokenModule;
      this.hashModule = hashModule;
      this.error = error
      this.key = key
      this.crypto = crypto
    }

    randomicPass() {
      return this.crypto.randomBytes(10).toString('hex')
  }
  
    async hash(password, salt) {
      if (!password) {
        throw this.error(1, 'missingPassword', "password undefined");
      } else if (!salt) {
        throw new Error("salt undefined");
      }
  
      return this.hashModule.hash(password, salt);
    }
  
    async compare(string, hashedPass) {
      
      if (!string) {
        throw this.error(1, 'missingPassword', "password undefined");
      } else if (!hashedPass) {
        throw new Error("hashedPass undefined");
      }
  
      return this.hashModule.compare(string, hashedPass);
    }
  
    decodePayload(token) {
      const parts = token.split(".");
      let payload = parts[1];
      payload = Buffer.from(payload, "base64").toString("utf-8");
      return JSON.parse(payload);
    }
  
    generateJwt(payload, exp) {
      return this.tokenModule.sign({ ...payload }, this.key, { expiresIn: exp });
    }
  
    decodePayload(token) {
      const parts = token.split(".");
      let payload = parts[1];
      payload = Buffer.from(payload, "base64").toString("utf-8");
      return JSON.parse(payload);
    }
  
    verifyJwt(token) {
      let decoded;
      try {
        decoded = this.tokenModule.verify(token, this.key);
        return {
          isValid: true,
          decoded,
        };
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return {
            isValid: false,
            decoded: "tokenExpired",
          };
        }
        return {
          isValid: false,
          decoded: "tokenInvalid",
        };
      }
    }
  }
  
  module.exports = Crypto