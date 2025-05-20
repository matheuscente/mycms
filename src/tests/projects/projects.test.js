const App = require("../../../app.js");
const request = require("supertest");
const transaction = require("../testTransaction.js");

describe("create projects tests", () => {
  let app;
  let appInstance;
  let technologiesResponse;
  let areasResponse;
  beforeEach(async () => {
    appInstance = new App();
    app = await appInstance.initServer();
    technologiesResponse = await request(app)
      .post("/api/v1/technologies/")
      .send({
        name: "js",
      });

    areasResponse = await request(app).post("/api/v1/areas/").send({
      name: "backend",
    });
  });
  afterEach(async () => {
    if (global._transaction) {
      await global._transaction.rollback();
      global._transaction = null;
    }
  });
  it("successfull project creation", async () => {
    const proprierts = {
      title: "cms",
      description: "criação de backend",
      areas: [areasResponse.body.area.id],
      technologies: [technologiesResponse.body.technology.id],
      year: 2024,
      inProgress: true,
    };
    const response = await request(app)
      .post("/api/v1/projects/")
      .send(proprierts);

    expect(response.statusCode).toBe(201);
    expect(response.body.project.id).toBe(1);
    expect(response.body.project.title).toBe(proprierts.title);
    expect(response.body.project.description).toBe(proprierts.description);
    expect(response.body.project.year).toBe(proprierts.year);
    expect(response.body.project.inProgress).toBe(proprierts.inProgress);
  });

  it("fail for missing area", async () => {
    const proprierts = {
      title: "cms",
      description: "criação de backend",
      areas: [2],
      technologies: [1],
      year: 2024,
      inProgress: true,
    };
    const response = await request(app)
      .post("/api/v1/projects/")
      .send(proprierts);

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].error).toBe("not found area in id 1");

  });

  it("fail for missing tecnology", async () => {
    const proprierts = {
      title: "cms",
      description: "criação de backend",
      areas: [1],
      technologies: [2],
      year: 2024,
      inProgress: true,
    };
    const response = await request(app)
      .post("/api/v1/projects/")
      .send(proprierts);



    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].error).toBe("an informed technology was not found");
  });
});
