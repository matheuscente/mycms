const projects = require("./projects.js");
const technologies = require("./technologies.js");
const projectsTechnologies = require("./projectsTechnologies.js");
const areas = require('./areas.js')
const session = require('./session.js')
const user = require('./user.js')


function assossiations() {
  //area and technologies assossiations
  projects.belongsToMany(technologies, {
    through: projectsTechnologies,
  });

  technologies.belongsToMany(projects, {
    through: projectsTechnologies,
  });


//area and project assossiations

projects.belongsTo(areas, {
    foreignKey: 'areaId'
})

areas.hasMany(projects, {
  foreignKey: 'areaId'
})

//users and sessions assossiations 
session.belongsTo(user, {
  foreignKey: "userId",
});

user.hasMany(session, {
  foreignKey: "userId",
});

  
}

module.exports = assossiations;