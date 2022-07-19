const { app } = require("../app");
const request = require("supertest");
const {
  User,
  Answer,
  Chapter,
  Task,
  Todo,
  QuestionWeeklyTest,
  QuestionKeyWeeklyTest,
} = require("../models/index");
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

const questionData = {
  subject: "PK",
  question:
    "Pada pukul 12.00 setiap harinya, Umar mengukur temperatur di kamarnya. Setelah dilakukan pengukuran dari hari Senin hingga Jumat, rata-rata temperatur di kamarnya adalah 22\\(^{o}\\)C. Temperatur terendah yang didapatkan Umar adalah 20\\(^{o}\\)C.~Berapakah temperatur tertinggi yang mungkin didapatkan Umar?",
  releaseDate: "20220719",
};

const keyData = [
  {
    QuestionWeeklyTestId: 1,
    answer: "23",
    correct: "FALSE",
  },
  {
    QuestionWeeklyTestId: 1,
    answer: "24",
    correct: "FALSE",
  },
  {
    QuestionWeeklyTestId: 1,
    answer: "25",
    correct: "FALSE",
  },
  {
    QuestionWeeklyTestId: 1,
    answer: "26",
    correct: "FALSE",
  },
  {
    QuestionWeeklyTestId: 1,
    answer: "30",
    correct: "TRUE",
  },
];

let access_token = "";
let access_token2 = "";

const Chapters = [
  {
    name: "Bacaan",
    subject: "PPU",
  },
  {
    name: "Info Spesifik",
    subject: "PPU",
  },
  {
    name: "Paragraf",
    subject: "PPU",
  },
];

const Tasks = [
  {
    description: "Menentukan judul",
    ChapterId: 1,
  },
  {
    description: "Menentukan tujuan utama atau tujuan paragraf",
    ChapterId: 1,
  },
  {
    description: "Menentukan topik utama bacaan atau topik paragraf",
    ChapterId: 1,
  },
];

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
      return QuestionWeeklyTest.create(questionData);
    })
    .then(() => {
      return QuestionKeyWeeklyTest.bulkCreate(keyData);
    })
    .then(() => {
      return Chapter.bulkCreate(Chapters);
    })
    .then(() => {
      return Task.bulkCreate(Tasks);
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
      return QuestionWeeklyTest.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return QuestionKeyWeeklyTest.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return Chapter.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      return Task.destroy({
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

describe("Question Weekly Routes Test", () => {
  test("200 Success Get Weekly Question Test", (done) => {
    request(app)
      .get("/questions-weekly/weekly/20220719")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));

        return done();
      });
  });
});
