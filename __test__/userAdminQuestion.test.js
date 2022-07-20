const { app } = require("../app");
const request = require("supertest");
const {
  User,
  Answer,
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
  role: "Admin",
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

const weeklyQuestion = {
  data: {
    Sheet1: [
      {
        subject: "ipa",
        question: "pertanyaan ipa",
        trueAnswer: "jawaban benar ipa",
        option1: "jawaban1",
        option2: "jawaban2",
        option3: "jawaban3",
        option4: "jawaban4",
      },
      {
        subject: "ips",
        question: "pertanyaan ips",
        trueAnswer: "jawaban benar ips",
        option1: "jawaban1",
        option2: "jawaban2",
        option3: "jawaban3",
        option4: "jawaban4",
      },
    ],
  },
  date: "20220719",
};

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
    .then((_) => {
      QuestionWeeklyTest.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      QuestionKeyWeeklyTest.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .catch((err) => {
      done(err);
    });
});

describe("Question weekly new", () => {
  test("200 Success Post Qustion", (done) => {
    request(app)
      .post("/users-admin/weekly-questions")
      .send(weeklyQuestion)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Object));

        return done();
      });
  });

  test("403 Unauthorized", (done) => {
    request(app)
      .post("/users-admin/weekly-questions")
      .send(weeklyQuestion)
      .set("access_token", access_token2)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        console.log(body);

        expect(status).toBe(403);
        expect(body).toEqual(expect.any(Object));

        return done();
      });
  });

  test("400 Subject is required", (done) => {
    request(app)
      .post("/users-admin/weekly-questions")
      .send({})
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;

        console.log(body);

        expect(status).toBe(400);
        expect(body).toEqual(expect.any(Object));

        return done();
      });
  });
});
