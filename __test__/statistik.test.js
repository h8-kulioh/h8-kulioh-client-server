const { app } = require("../app");
const request = require("supertest");
const {
  User,
  Question,
  Answer,
  QuestionKey,
  sequelize,
} = require("../models/index");
const { createToken, verifiedToken } = require("../helpers/jwt&bcrypt");
const { queryInterface } = sequelize;
const userTest1 = {
  email: "user1@mail.com",
  password: "usertest1",
  name: "User Test 1",
  major: [1, 2],
};

const questionData = {
  subject: "PK",
  question:
    "Pada pukul 12.00 setiap harinya, Umar mengukur temperatur di kamarnya. Setelah dilakukan pengukuran dari hari Senin hingga Jumat, rata-rata temperatur di kamarnya adalah 22\\(^{o}\\)C. Temperatur terendah yang didapatkan Umar adalah 20\\(^{o}\\)C.~Berapakah temperatur tertinggi yang mungkin didapatkan Umar?",
  releaseDay: "1",
};

const keyData = [
  {
    QuestionId: 1,
    answer: "23",
    correct: "FALSE",
  },
  {
    QuestionId: 1,
    answer: "24",
    correct: "FALSE",
  },
  {
    QuestionId: 1,
    answer: "25",
    correct: "FALSE",
  },
  {
    QuestionId: 1,
    answer: "26",
    correct: "FALSE",
  },
  {
    QuestionId: 1,
    answer: "30",
    correct: "TRUE",
  },
];

let access_token = "";
let falseAcess_token = "kmsxkamsxkamskxamsxk"

beforeAll((done) => {
  User.create(userTest1)
    .then((registeredUser) => {
      access_token = createToken({
        id: registeredUser.id,
        name: registeredUser.name,
        role: registeredUser.role,
        email: registeredUser.email,
      });
      return Question.create(questionData);
    })
    .then(() => {
      return QuestionKey.bulkCreate(keyData);
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
      return Question.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return QuestionKey.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
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
          expect(body).toEqual(expect.any(Object));

          return done();
        });
    });

    test("401 Error Get Statistik", (done) => {
      request(app)
        .get("/users/stat")
        .set("access_token", falseAcess_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toEqual(expect.any(Object));

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
          expect(body).toEqual(expect.any(Object));
          
          return done();
        });
    });

    test("401 Failed Get Task Statistik", (done) => {
      request(app)
        .get("/users/taskStat")
        .set("access_token", falseAcess_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toEqual(expect.any(Object));
          
          return done();
        });
    });
  });

  describe("GET /users/allAnswer - get user Answer", () => {
    test("201 Success Get User Answer", (done) => {
      request(app)
        .get("/users/allAnswer")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toEqual(expect.any(Array));

          return done();
        });
    });

    test("401 Failed Get User Answer", (done) => {
      request(app)
        .get("/users/allAnswer")
        .set("access_token", falseAcess_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toEqual(expect.any(Object));

          return done();
        });
    });
  });
});
