
const App = require("../../../app.js");
const request = require("supertest");
const transaction = require('../testTransaction.js')

describe("create areas tests", () => {
  let app;
  let appInstance;
  beforeAll(async () => {
    appInstance = new App();
    app = await appInstance.initServer();

      
  });

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    transaction.then((transaction) => {
      if(!transaction.finished) {
        transaction.rollback()
      }
      
    })
  });
  
  it("successfull area creation", async () => {
    const proprierts = {
      name: "back end",
      description: "criação de backend"
    }
      const response = await request(app)
      .post("/api/v1/areas/")
      .send(proprierts);
      proprierts.id = 1
      const responseCopy = {...response.body.area}
      delete responseCopy.createdAt
      delete responseCopy.updatedAt


    expect(response.statusCode).toBe(201);
    expect(responseCopy).toEqual(proprierts)
    expect(response.body.area).toHaveProperty('createdAt')
    expect(response.body.area).toHaveProperty('updatedAt')
    
  });

  it("fail for required name", async () => {
    const proprierts = {

    }
    const response =  await request(app)
    .post("/api/v1/areas/")
    .send(proprierts);


  expect(response.statusCode).toBe(400);
  expect(response.body).toHaveProperty('errors')
  expect(response.body.errors.length).toBe(1)
  expect(response.body.errors[0].error).toBe("name is required")
  
});

it("fail for empty name", async () => {
  const proprierts = {
    "name": ""
  }
  const response =  await request(app)
  .post("/api/v1/areas/")
  .send(proprierts);

console.log(response.body)
expect(response.statusCode).toBe(400);
expect(response.body).toHaveProperty('errors')
expect(response.body.errors.length).toBe(1)
expect(response.body.errors[0].error).toBe("name is not allowed to be empty")

});

it("fail for long name", async () => {
  const proprierts = {
    name: "aaaaaaaaaaaaaaaaaaaaa"
  }
  const response =  await request(app)
  .post("/api/v1/areas/")
  .send(proprierts);

console.log(response.body)
expect(response.statusCode).toBe(400);
expect(response.body).toHaveProperty('errors')
expect(response.body.errors.length).toBe(1)
expect(response.body.errors[0].error).toBe("name length must be less than or equal to 20 characters long")

});

it("fail for long description", async () => {
  const proprierts = {
    name: "cms",
    description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  }
  const response =  await request(app)
  .post("/api/v1/areas/")
  .send(proprierts);

console.log(response.body)
expect(response.statusCode).toBe(400);
expect(response.body).toHaveProperty('errors')
expect(response.body.errors.length).toBe(1)
expect(response.body.errors[0].error).toBe("description length must be less than or equal to 80 characters long")

});

it("fail because name is not a string", async () => {
  const proprierts = {
    name: 1,
    description: "test"
  }
  const response =  await request(app)
  .post("/api/v1/areas/")
  .send(proprierts);

console.log(response.body)
expect(response.statusCode).toBe(400);
expect(response.body).toHaveProperty('errors')
expect(response.body.errors.length).toBe(1)
expect(response.body.errors[0].error).toBe("name must be a string")

});

it("fail because description is not a string", async () => {
  const proprierts = {
    name: "test",
    description: 1
  }
  const response =  await request(app)
  .post("/api/v1/areas/")
  .send(proprierts);

console.log(response.body)
expect(response.statusCode).toBe(400);
expect(response.body).toHaveProperty('errors')
expect(response.body.errors.length).toBe(1)
expect(response.body.errors[0].error).toBe("description must be a string")

});



});
