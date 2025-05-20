const technologiesService = require("../../dependences-conteiners/services/technologies.js");
const error = require('../../fns/error.js')

class TechnologiesMiddleware {
  
    async isTechsInBD(technologies, transaction) {
    async function IdTechsInBD() {
      const techs = await technologiesService.findAll(transaction);
      return techs.map((item) => {
        return item.id;
      });
    }

    const techsInBD = await IdTechsInBD();
    const isTechsInBD = technologies.map((tech) => {
      if (!techsInBD.includes(tech)) {
        return false;
      }
    });

    if (isTechsInBD.includes(false)) {
      return false;
    } else {
      return true;
    }
  }

}

module.exports = new TechnologiesMiddleware();
