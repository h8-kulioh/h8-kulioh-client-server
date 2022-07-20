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

describe("User Routes Test", () => {
  describe("Handle Payment", () => {
    test("200 Success Get Token Payment", (done) => {
      request(app)
        .post("/users/handlepayment")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("TokenPayment", expect.any(String));

          return done();
        });
    });

    test("403 User already Premium", (done) => {
      request(app)
        .post("/users/handlepayment")
        .set("access_token", access_token2)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(403);
          expect(body).toHaveProperty("message", expect.any(String));

          return done();
        });
    });

    

    test("200 Change to Premium", (done) => {
      request(app)
        .patch("/users/premium")
        .set("access_token", access_token)
        .send({
          role: "Premium",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("message", expect.any(String));

          return done();
        });
    });

    test("400 Error Change to Premium", (done) => {
      request(app)
        .patch("/users/premium")
        .set("access_token", access_token2)
        .send({
          status: "Premium",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", expect.any(String));

          return done();
        });
    });
  });
});
