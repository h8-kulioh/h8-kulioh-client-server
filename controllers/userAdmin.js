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
  University,
  Chapter,
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
      res.status(200).json({ name: "Succes create question and answer key" });
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
        throw { name: "Question is required" };
      }
      if (!releaseDay) {
        throw { name: "Release Day is required" };
      }
      if (!answer) {
        throw { name: "Answer is required" };
      }
      if (!correct) {
        throw { name: "Correct is required" };
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
      res.status(200).json({ name: "Succes update question and answer key" });
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
      res.status(200).json({ name: "Succes delete question and answer key" });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }

  static async createChaptersTasks(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { name, subject, description } = req.body;

      if (!name) {
        throw { name: "Name is required" };
      }
      if (!subject) {
        throw { name: "Subject is required" };
      }
      if (!description) {
        throw { name: "Description is required" };
      }

      const insertDataCahpter = { name, subject };

      const newCahpter = await Chapter.create(insertDataCahpter);

      const insertDataTask = {
        description,
        ChapterId: newCahpter.id,
      };

      const newTask = await Task.create(insertDataTask);
      t.commit();

      res.status(200).json({ name: "Success create new Chapter and Task" });
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }

  static async updateChaptersTasks(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { name, subject, description } = req.body;

      if (!name) {
        throw { name: "Name is required" };
      }
      if (!subject) {
        throw { name: "Subject is required" };
      }
      if (!description) {
        throw { name: "Description is required" };
      }

      const editDataChapter = { name, subject };

      const updateChapter = await Chapter.update(editDataChapter, {
        where: {
          id,
        },
      });

      const updateTask = await Task.update(
        { description },
        {
          where: {
            ChapterId: id,
          },
        }
      );
      t.commit();

      res.status(200).json({ name: "Success edit Chapter and Task" });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }

  static async deleteChaptersTasks(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;

      const deleteChapter = await Chapter.destroy({
        where: {
          id,
        },
      });

      if (deleteChapter !== 1) {
        throw { name: "Chapter/Task not found" };
      }

      const deleteTask = await Task.destroy({
        where: {
          ChapterId: id,
        },
      });
      t.commit();

      res.status(200).json({ name: "Success delete Chapter and Task" });
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  }

  static async createUniversity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { name, majorsName } = req.body;
      if (!name) {
        throw { name: "University name is required" };
      }
      if (!majorsName) {
        throw { name: "University major name is required" };
      }

      const newUniveristy = await University.create({ name });

      const insertDataMajor = {
        name: majorsName,
        UniversityId: newUniveristy.id,
      };

      const newMajor = await Major.create(insertDataMajor);
      t.commit();
      res.status(200).json({ name: "Success create new University and Major" });
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }

  static async updateUniversity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { name, majorsName } = req.body;
      if (!name) {
        throw { name: "University name is required" };
      }
      if (!majorsName) {
        throw { name: "University major name is required" };
      }

      const editUniv = await University.update(
        { name },
        {
          where: {
            id,
          },
        }
      );

      if (editUniv[0] !== 1) {
        throw { name: "University not found" };
      }

      const editMajor = await Major.update(
        { name: majorsName },
        {
          where: {
            UniversityId: id,
          },
        }
      );
      t.commit();
      res.status(200).json({ name: "Success update University and Major" });
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }

  static async deleteUniversity(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;

      const deleteUniv = await University.destroy({
        where: {
          id,
        },
      });


      if (deleteUniv !== 1) {
        throw { name: "University not found" };
      }

      const editMajor = await Major.destroy({
        where: {
          UniversityId: id,
        },
      });
      t.commit();
      res.status(200).json({ name: "Success delete University and Major" });
    } catch (error) {
      t.rollback();

      console.log(error);
    }
  }
}

module.exports = {
  UserAdminController,
};
