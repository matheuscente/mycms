const database = require("../../database.js");
const validator = require("../../validations/validation.js");

class Middleware {
  constructor() {
    this.httpCodeError = [{ 1: 400 }, { 2: 401 }, { 3: 403 }, { 4: 500 }];
  }
  // errorHandler Middleware
  async errorHandler(errorParameter, req, res, next) {
    if (!process.env.IS_TEST && req.transaction && !req.transaction.finished) {
      await req.transaction.rollback();
    }

    let httpStatus, error;
    if (!Array.isArray(errorParameter)) {
      error = [errorParameter];
    } else {
      error = errorParameter;
    }

    const objectError = error.map((error) => {
      console.error(error.stack);
      return { error: error.message, name: error.name };
    });
    httpStatus = this.defineHttpCodeError(error[0]);

    res.status(httpStatus).json({
      errors:
        httpStatus === 500 ? [
            {error: "an internal error was ocurred",
              name: 'internalError'
            }
          ] : objectError
    });
    return;
  }



  defineHttpCodeError(error) {
    try {
      const codeError = error.code;
      const returnCodeError = this.httpCodeError.filter((code) => {
        return codeError == Object.keys(code);
      });
      if (returnCodeError.length >= 1) {
        return returnCodeError[0][codeError];
      }
    } catch (err) {
      console.log(err);
    }
    return 500;
  }

  // transaction middlewares

  async openTransaction(req, res, next) {

    if(req.method === "POST" || req.method === "PUT" || req.method === "DELETE")  req.transaction = await database.db.transaction();

    next();
  }

   //validator for req data
  dataValidator(schema, dataForValidate) {
    return (req, res, next) => {
      const validations = validator.validate(
        validator[schema],
        req[dataForValidate]
      );
      const errors = validator.checkErrors(validations);
      if (errors) {
        next(errors);
        return;
      }
      next();
    };
  }
}

module.exports = new Middleware();
