const {
  verifiedPass,
  createToken,
  hashPass,
} = require("../helpers/jwt&bcrypt");
const {
  User,
  Question,
  UserMajor,
  sequelize,
  QuestionKey,
  Major,
  Task,
  Todo,
} = require("../models/index");
const midtransClient = require("midtrans-client");
const { SERVERKEY, CLIENTKEY } = process.env;

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
      console.log(error);
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
      console.log(error);
    }
  }

  static async createDailyQuestions(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { subject, question, releaseDay, answer, correct } = req.body;
      if (!subject) {
        throw { name: "Subject is required" };
      }
      if (!question) {
        throw { name: "Subject is required" };
      }
      if (!releaseDay) {
        throw { name: "Subject is required" };
      }
      if (!answer) {
        throw { name: "Subject is required" };
      }
      if (!correct) {
        throw { name: "Subject is required" };
      }

      const insertData = { subject, question, releaseDay };

      const newDailyQuestion = await Question.create(insertData);

      const dataAnswer = await answer.map((el, i) => {
        return {
          QuestionId: newDailyQuestion.id,
          answer: el,
          correct: correct[i],
        };
      });

      const newDailyQuestionKey = await QuestionKey.bulkCreate(dataAnswer);
      t.commit();
      res.status(200).json(newDailyQuestion);
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }

  static async updateDailyQuestions(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { subject, question, releaseDay, answer, correct } = req.body;
      if (!subject) {
        throw { name: "Subject is required" };
      }
      if (!question) {
        throw { name: "Subject is required" };
      }
      if (!releaseDay) {
        throw { name: "Subject is required" };
      }
      if (!answer) {
        throw { name: "Subject is required" };
      }
      if (!correct) {
        throw { name: "Subject is required" };
      }

      const editData = { subject, question, releaseDay };

      const newDailyQuestion = await Question.update(editData, {
        where: {
          id,
        },
      });

      const editAnswer = await answer.map((el, i) => {
        return {
          QuestionId: id,
          answer: el,
          correct: correct[i],
        };
      });

      await QuestionKey.destroy({
        where: {
          QuestionId: id,
        },
      });

      const newDailyQuestionKey = await QuestionKey.bulkCreate(editAnswer);
      t.commit();
      res.status(200).json(newDailyQuestion);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }

  static async deleteDailyQuestions(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const deleteQustions = await Question.destroy({
        where: {
          id,
        },
      });

      const deleteQustionsKey = await QuestionKey.destroy({
        where: {
          QuestionId: id,
        },
      });
      t.commit();
      res.status(200).json(deleteQustionsKey);
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }
}

module.exports = {
  UserAdminController,
};
