const { app } = require("../app");
const request = require("supertest");
const { User } = require("../models/index");

const user1 = {
  email: "user.test@mail.com",
  password: "usertest",
  name: "User Test",
  major: ["1", "2"],
};

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("User Routes Test", () => {
  describe("POST /users/register - create new user", () => {
    test("201 Success register - should create new User", (done) => {
      request(app)
        .post("/users/register")
        .send(user1)
        .end((err, res) => {
          console.log(err);
          console.log(res.body);
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("name", user1.name);
          return done();
        });
    });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/users-register")
        .send({
          password: "usertest",
          name: "User Test",
          major: ["1", "2"],
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });
  });
});
