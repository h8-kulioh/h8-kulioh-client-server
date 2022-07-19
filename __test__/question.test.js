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

describe("Question Routes Test", () => {
  describe("GET /questions/daily - get daily question", () => {
    test("200 Success Get Daily Question", (done) => {
      request(app)
        .get("/questions/daily")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toEqual(expect.any(Array));
          return done();
        });
    });

    test("401 No Access Token", (done) => {
        request(app)
          .get("/questions/daily")
          .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
  
            expect(status).toBe(401);
            expect(body.message).toEqual(expect.any(String));
            return done();
          });
      });


      test("401 Invalid Access Token", (done) => {
        request(app)
          .get("/questions/daily")
          .set("access_token", "This is not a valid access_token")
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