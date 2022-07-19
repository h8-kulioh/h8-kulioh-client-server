const { app } = require("../app");
const request = require("supertest");
const { User } = require("../models/index");
const { createToken } = require("../helpers/jwt&bcrypt");

const userTest1 = {
  email: "user.test@mail.com",
  password: "usertest",
  name: "User Test",
  major: ["1", "2"],
};

const userLogin1 = {
  email: "user.test@mail.com",
  password: "usertest",
};

const userTest2 = {
  email: "user.test2@mail.com",
  password: "usertest2",
  name: "User Test 2",
  major: ["1", "2"],
};

const userLogin2 = {
  email: "user.test2@mail.com",
  password: "usertest2",
};

let trueToken1 = "";
let falseToken = "";
let trueToken2 = "";

beforeAll((done) => {
  User.create(userTest1)
    .then((registeredUser) => {
      trueToken1 = createToken({
        id: registeredUser.id,
        name: registeredUser.name,
        role: registeredUser.role,
      });
      falseToken =
        "12345678eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9";
      return User.create(userTest2);
    })
    .then((registeredUser2) => {
      trueToken2 = createToken({
        id: registeredUser2.id,
        name: registeredUser2.name,
        role: registeredUser2.role,
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

describe("User Routes Test", () => {
  describe("POST /users/login - login user admin", () => {
    test("201 Success login - Success Login admin", (done) => {
      request(app)
        .post("/users-admin/login")
        .send(userLogin1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body.access_token).toEqual(expect.any(String));

          return done();
        });
    });

    test("400 Failed login - should return error if email is null", (done) => {
      request(app)
        .post("/users-admin/login")
        .send({
          password: "aku pusing",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body.message).toEqual(expect.any(String));
          return done();
        });
    });

    test("400 Failed login - should return error if password is null", (done) => {
      request(app)
        .post("/users-admin/login")
        .send({
          email: "syalala",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;


          expect(status).toBe(400);
          expect(body.message).toEqual(expect.any(String));
          return done();
        });
    });

    test("400 Failed login - should return error if email/password is invalid", (done) => {
      request(app)
        .post("/users-admin/login")
        .send({
          email: "kkkkk@email.com",
          password: "usertestapakah",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body.message).toEqual(expect.any(String));
          return done();
        });
    });
  });
});
