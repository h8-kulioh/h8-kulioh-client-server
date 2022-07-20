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
  describe("POST /users/register - create new user admin", () => {
    test("201 Success register - should create new User", (done) => {
      request(app)
        .post("/users-admin/register")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toEqual(expect.any(Object));
          return done();
        });
    });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/users-admin/register")
        .send({
          name: "yuhuhuhu",
          password: "apa yaa",
          major: ["1", "5"],
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed register - should return error if password is null", (done) => {
      request(app)
        .post("/users-admin/register")
        .send({
          email: "yuhuhuhu",
          name: "apa yaa",
          major: ["1", "5"],
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });

    test("400 Failed register - should return error if name is null", (done) => {
      request(app)
        .post("/users-admin/register")
        .send({
          email: "yuhuhuhu",
          password: "apa yaa",
          major: ["1", "5"],
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Name is required");
          return done();
        });
    });
  });
});
