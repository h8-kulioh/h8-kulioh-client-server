const { app } = require("../app");
const request = require("supertest");
const { User } = require("../models/index");
const { createToken } = require("../helpers/jwt&bcrypt");

const userTest1 = {
  email: "user1@mail.com",
  password: "usertest1",
  name: "User Test 1",
  major: ["1", "2"],
};

let access_token = "";

beforeAll((done) => {
  User.create(userTest1)
    .then((registeredUser) => {
      access_token = createToken({
        id: registeredUser.id,
        name: registeredUser.name,
        role: registeredUser.role,
        email: registeredUser.email,
      });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Profile Routes Test", () => {
  describe("GET /users/profile - get profile", () => {
    test("201 Success Get Profile", (done) => {
      request(app)
        .get("/users/profile")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body.email).toEqual(expect.any(String));
          expect(body.password).toEqual(expect.any(String));
          expect(body.name).toEqual(expect.any(String));
          expect(body.UserMajors).toEqual(expect.any(Array));
          return done();
        });
    });
  });
});
