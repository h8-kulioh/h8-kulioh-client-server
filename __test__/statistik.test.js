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

describe("User Routes Test", () => {
  describe("GET /users/stat - get statistik", () => {
    test("201 Success Get Statistik", (done) => {
      request(app)
        .get("/users/stat")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body.jumlahBenar).toEqual(expect.any(Number));
          expect(body.jumlahSoal).toEqual(expect.any(Number));
          expect(body.perPU).toEqual(expect.any(Object));
          expect(body.perPPU).toEqual(expect.any(Object));
          expect(body.perPK).toEqual(expect.any(Object));
          expect(body.perPBM).toEqual(expect.any(Object));
          expect(body.perAll).toEqual(expect.any(Object));


          return done();
        });
    });
  });

  describe("GET /users/taskStat - get task statistik", () => {
    test("201 Success Get Task Statistik", (done) => {
      request(app)
        .get("/users/taskStat")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body.jumlahtodos).toEqual(expect.any(Number));
          expect(body.jumlahDone).toEqual(expect.any(Number));
          expect(body.perPU).toEqual(expect.any(Object));
          expect(body.perPPU).toEqual(expect.any(Object));
          expect(body.perPK).toEqual(expect.any(Object));
          expect(body.perPBM).toEqual(expect.any(Object));
          expect(body.perAll).toEqual(expect.any(Object));

          return done();
        });
    });
  });

  
});
