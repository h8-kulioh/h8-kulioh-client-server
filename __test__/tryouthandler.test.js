const { app } = require("../app");
const request = require("supertest");
const { User, TryOutHandler } = require("../models/index");
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
      TryOutHandler.create({
        tryoutdate: '20220719',
        UserId: registeredUser.id,
        tryoutstart: 1
    })
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

describe("TryOut Routes Test", () => {
    describe("GET /tryOut/YYYYMMDD - get tryout", () => {
      test("200 Success Get TryOut", (done) => {
        request(app)
          .get("/users/tryOut/20220719")
          .set("access_token", access_token)
          .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
  
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Object));
            return done();
          });
      });


      test("404 Not Found Get TryOut", (done) => {
        request(app)
          .get("/users/tryOut/20220720")
          .set("access_token", access_token)
          .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
  
            expect(status).toBe(404);
            expect(body).toEqual(expect.any(Object));
            return done();
          });
      });
    });

    describe("POST /tryOut/YYYYMMDD - get tryout", () => {
        test("201 Success Get TryOut", (done) => {
          request(app)
            .post("/users/tryOut/20220719")
            .set("access_token", access_token)
            .send({tryoutstart: 1})
            .end((err, res) => {
              if (err) return done(err);
              const { body, status } = res;
    
              expect(status).toBe(201);
              expect(body).toEqual(expect.any(Object));
              return done();
            });
        });
  
  
        test("400 Not Found Get TryOut", (done) => {
          request(app)
            .post("/users/tryOut/20220720")
            .set("access_token", access_token)
            .end((err, res) => {
              if (err) return done(err);
              const { body, status } = res;
    
              expect(status).toBe(400);
              expect(body).toEqual(expect.any(Object));
              return done();
            });
        });
      });
  });