const { verifiedPass, createToken } = require("../helpers/jwt&bcrypt");
const {
  User,
  sequelize,
  QuestionWeeklyTest,
  QuestionKeyWeeklyTest,
} = require("../models/index");

class UserAdminController {
  static async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      const role = "Admin";
      const inputData = { email, password, name, role };

      if (!email) {
        throw { name: "Email is required" };
      }

      if (!password) {
        throw { name: "Password is required" };
      }

      if (!name) {
        throw { name: "Name is required" };
      }

      const newAdmin = await User.create(inputData);

      const result = {
        id: newAdmin.id,
        name: newAdmin.name,
        role: newAdmin.role,
      };
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "Email is required" };
      }

      if (!password) {
        throw { name: "Password is required" };
      }

      const findUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw { name: "Invalid email/password" };
      }

      const checkPass = verifiedPass(password, findUser.password);

      if (!checkPass) {
        throw { name: "Invalid email/password" };
      }

      const payload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      };

      const token = createToken(payload);

      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }

  static async createWeeklyQuestions(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { Sheet1 } = req.body;
      if (!Sheet1) {
        throw { name: "Subject is required" };
      }

      for (let el of Sheet1) {
        let addQweekly = await QuestionWeeklyTest.create(
          {
            subject: el.subject,
            question: el.question,
            releaseDate: el.releaseDate,
          },
          { transaction: t }
        );

        let addKey1 = await QuestionKeyWeeklyTest.create(
          {
            QuestionWeeklyTestId: addQweekly.id,
            answer: el.trueAnswer,
            correct: true,
          },
          { transaction: t }
        );

        let addKey2 = await QuestionKeyWeeklyTest.create(
          {
            QuestionWeeklyTestId: addQweekly.id,
            answer: el.option1,
            correct: false,
          },
          { transaction: t }
        );

        let addKey3 = await QuestionKeyWeeklyTest.create(
          {
            QuestionWeeklyTestId: addQweekly.id,
            answer: el.option2,
            correct: false,
          },
          { transaction: t }
        );

        let addKey4 = await QuestionKeyWeeklyTest.create(
          {
            QuestionWeeklyTestId: addQweekly.id,
            answer: el.option3,
            correct: false,
          },
          { transaction: t }
        );

        let addKey5 = await QuestionKeyWeeklyTest.create(
          {
            QuestionWeeklyTestId: addQweekly.id,
            answer: el.option4,
            correct: false,
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(200).json({ name: "Succes create question and answer key" });
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }
}

module.exports = {
  UserAdminController,
};
