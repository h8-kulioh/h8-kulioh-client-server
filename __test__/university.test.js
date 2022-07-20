const { app } = require("../app");
const request = require("supertest");
const { User, Answer } = require("../models/index");
const { createToken, verifiedToken } = require("../helpers/jwt&bcrypt");
const userTest1 = {
  email: "user1@mail.com",
  password: "usertest1",
  name: "User Test 1",
  major: [1, 2],
  role: "Regular",
};

const userTest2 = {
  email: "user2@mail.com",
  password: "usertest2",
  name: "User Test 2",
  major: [5, 6],
  role: "Premium",
};

const userLogged1 = {
  email: "user1@mail.com",
  name: "User Test 1",
};

const userLogged2 = {
  email: "user2@mail.com",
  password: "usertest2",
};

let access_token = "";
let access_token2 = "";

beforeAll((done) => {
  User.create(userTest1)
    .then((registeredUser) => {
      access_token = createToken({
        id: registeredUser.id,
        name: registeredUser.name,
        role: registeredUser.role,
        email: registeredUser.email,
      });
      return User.create(userTest2);
    })
    .then((registerUser2) => {
      access_token2 = createToken({
        id: registerUser2.id,
        name: registerUser2.name,
        role: registerUser2.role,
        email: registerUser2.email,
      });
    })
    .then(() => {
      return Answer.create({
        QuestionId: 1,
        UserId: verifiedToken(access_token).id,
        userAnswer: "1",
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

describe("University Routes Test", () => {
  test("200 Success Get University", (done) => {
    request(app)
      .get("/universityroute/university")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));

        return done();
      });
  });

  test("200 Success Get University by Id", (done) => {
    request(app)
      .get("/universityroute/university/1")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Object));

        return done();
      });
  });

  test("404 Failed University not found", (done) => {
    request(app)
      .get("/universityroute/university/1000")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(404);
        expect(body.message).toEqual(expect.any(String));

        return done();
      });
  });

  test("404 Failed University not found", (done) => {
    request(app)
      .get("/universityroute/university?name=universitas hantu")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(404);
        expect(body.message).toEqual(expect.any(String));

        return done();
      });
  });
});
