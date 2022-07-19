const { app } = require("../app");
const request = require("supertest");
const { User } = require("../models/index");
const { createToken } = require("../helpers/jwt&bcrypt");


Date.prototype.yyyymmdd = function() {
    const mm = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('');
  };
  
  const date = new Date().yyyymmdd();


const userTest1 = {
  email: "user1@mail.com",
  password: "usertest1",
  name: "User Test 1",
  major: ["1", "2"],
};

let access_token = "";

const answer = {
    "userAnswer": [5, 78, 151, 227],
    "QuestionId": [1, 16, 31, 46]
}

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

  describe("POST /questions/answer/daily - post daily question answer", () => {
    test("200 Success POST Daily Answer", (done) => {
      request(app)
        .post("/questions/answers/daily")
        .set("access_token", access_token)
        .send(answer)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toEqual(expect.any(Array));
          return done();
        });
    });

    test("400 Failed POST Daily Answer", (done) => {
        request(app)
          .post("/questions/answers/daily")
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

  describe("GET /questions/answers/daily/:YYYYMMDD - get daily question by date", () => {
    test("200 Success Get Daily Answer", (done) => {
      request(app)
        .get(`/questions/answers/daily/${date}`)
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toEqual(expect.any(Array));
          return done();
        });
    });

    test("404 not found Get Daily Answer", (done) => {
        request(app)
          .get(`/questions/answers/daily/thisisnotadate`)
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
});