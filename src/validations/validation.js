const validator = require("joi");
const error = require("../fns/error.js");

class Validation {
  constructor() {
    this.loginSchema = validator.object({
      userName: validator.string().required(),
      password: validator.string().required()
    })

    this.logoutSchema = validator.object({
      refreshToken: validator.string().required()
    })
    
    this.idSchema = validator.object({
      id: validator.number().required(),
    });

    this.createUserSchema = validator.object({
      name: validator.string().required().max(20),
      userName: validator.string().required().min(5).max(20),
      password: validator.string().required().min(8).max(50),
      role: validator.string().required().valid("admin", "guest"),
    });

    this.updateUserSchema = validator.object({
      field: validator
        .string()
        .required()
        .valid("name", "userName", "password", "role"),
      value: validator.alternatives().conditional("field", {
        switch: [
          { is: "name", then: validator.string().required().max(20) },
          { is: "userName", then: validator.string().required().min(5).max(20) },
          {
            is: "password",
            then: validator.string().required().min(8).max(50),
          },
          {
            is: "role",
            then: validator.string().required().valid("admin", "guest"),
          },
        ],
        otherwise: validator.forbidden(),
      }),
    });

    this.createTechAndAreaSchema = validator.object({
      title: validator.string().required().max(50),
      description: validator.string().max(300),
    });

    this.updateFields = ["title", "description"];

    this.updateTechAndAreaSchema = validator.object({
     title: validator.string().max(50).empty(''),
      description: validator.string().max(300).empty(''),
    });

    this.updateProjectSchema = validator.object({
     title: validator.string().max(50).empty(''),
      description: validator.string().max(300).empty(''),
      url: validator.string().max(200).empty(''),
      year: validator.number().empty(''),
      inProgress: validator.boolean().empty(''),
      technologies: validator
        .array()
        .items(validator.number())
        .min(1).allow(false),
      area: validator.number().empty(''),
    });

    this.createProjectsSchema = validator.object({
      title: validator.string().required().max(50),
      description: validator.string().max(300),
      url: validator.string().max(200),
      year: validator.number().required(),
      inProgress: validator.boolean().required(),
      technologies: validator
        .array()
        .items(validator.number())
        .min(1)
        .required(),
      area: validator.number().required(),
    });
  }

  validate(schema, data) {
    return schema.validate(data, { abortEarly: false });
  }
  checkErrors(validations) {
    if (validations.error) {
      let errors = validations.error.details.map((detail) => {
        const returnErros = detail.message.replaceAll('"', "");
        return error(1, "validationError", returnErros);
      });
      return errors;
    }
  }
}

module.exports = new Validation();
