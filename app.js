const express = require("express");
const database = require("./src/database.js");
const middleware = require("./src/middleware/global/middleware.js");
const projectsRoute = require("./src/routes/projects.js");
const tecnologiesRoute = require("./src/routes/technologies.js");
const areasRoute = require('./src/routes/areas.js')
const sessionRoute = require('./src/routes/session.js')
const userRoute = require('./src/routes/user.js')
const sessionController = require('./src/dependences-conteiners/controllers/session.js')
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const error = require('./src/fns/error.js');
const assossiations = require("./src/entities/models/assossiations.js");
const cors = require('cors')

const port = process.env.LISTEN_PORT ?? 3000;

class App {
  constructor() {
    this.error = error
    this.app = express();
    this.appConfigs();
    this.appRoutes();
    
  }

  appConfigs() {
    this.app.use(helmet())
    this.app.use(express.json());
    this.app.use(cookieParser())
    this.app.use(cors({
      origin: 'https://matheuscente.github.io',
      credentials: true
    }))

  }

  appRoutes() {
    //routes that need authentication
    this.app.use(middleware.openTransaction)

    this.app.post("/api/v1/login", middleware.dataValidator('loginSchema', 'body'), sessionController.login.bind(sessionController));
    this.app.get("/unauthorized", (req, res) => {
      res.status(401).send()
    })

    this.app.use("/api/v1/projects", projectsRoute);
    this.app.use("/api/v1/technologies", tecnologiesRoute);
    this.app.use('/api/v1/areas', areasRoute)
    this.app.use('/api/v1/users', userRoute)
    this.app.use('/api/v1/session', sessionRoute)


    this.app.use(middleware.errorHandler.bind(middleware));
  }

  async initServer() {
    await database.db.sync({ force: false });
     try {
      return this.app.listen(port, () => {
        assossiations()
          console.log(`app running in ${port} port`)
      })
    } catch (error) {
      console.error(`a error was occurred: ${error}`);
      throw this.error(null, 'serverInitFail', 'an error occurred while trying to initialize the server');
    }
  }
}

module.exports = App;
