const { app } = require("../app");
const request = require("supertest");
const { User, Answer, Todo } = require("../models/index");
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
let falseAccessToken = "this is not a valid access_token";

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
      return Todo.create({
        UserId: verifiedToken(access_token).id,
        TaskId: 1,
        status: false,
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

describe("Chapter Routes Test", () => {
  test("200 Success Get Chapter", (done) => {
    request(app)
      .get("/chaptersroute/chapters")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));

        return done();
      });
  });
  test("401 Failed Get Chapter", (done) => {
    request(app)
      .get("/chaptersroute/chapters")
      .set("access_token", falseAccessToken)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(401);
        expect(body).toEqual(expect.any(Object));

        return done();
      });
  });
});
