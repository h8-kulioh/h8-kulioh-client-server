const {
  verifiedPass,
  createToken,
  hashPass,
} = require("../helpers/jwt&bcrypt");
const {
  User,
  UserMajor,
  sequelize,
  Major,
  Task,
  Todo,
  University,
  Answer,
  Question,
  QuestionKey,
  Chapter,
  AnswerWeeklyTest,
  QuestionWeeklyTest,
  QuestionKeyWeeklyTest,
} = require("../models/index");
const midtransClient = require("midtrans-client");
const { SERVERKEY, CLIENTKEY } = process.env;

class userController {
  static async register(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { email, password, name } = req.body;
      const role = "Regular";
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

      const newUser = await User.create(inputData);
      const usermajor = req.body.major.map((MajorId) => {
        return {
          UserId: newUser.id,
          MajorId,
        };
      });
      await UserMajor.bulkCreate(usermajor);

      const getTask = await Task.findAll();
      const postTodos = getTask.map((el) => {
        return {
          UserId: newUser.id,
          TaskId: el.id,
          status: "False",
        };
      });
      await Todo.bulkCreate(postTodos);

      const result = {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      };
      t.commit();
      res.status(201).json(result);
    } catch (error) {
      t.rollback();
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
        include: [{ model: Major, include: [University] }],
      });

      if (!findUser || !verifiedPass(password, findUser.password)) {
        throw { name: "Invalid email/password" };
      }

      const payload = {
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
      };

      const token = createToken(payload);

      res.status(200).json({
        access_token: token,
        majors: findUser.Majors,
        name: findUser.name,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { id } = req.user;
      const allUser = await User.findByPk(id, {
        include: [
          {
            model: UserMajor,
            include: [{ model: Major, include: [University] }],
          },
        ],
      });
      res.status(200).json(allUser);
    } catch (error) {
      next(error);
    }
  }

  static async handlepayment(req, res, next) {
    try {
      const { role } = req.user;

      if (role === "Premium") {
        throw { name: "You are already premium" };
      }

      const emailUser = req.user.email;
      const nameUser = req.user.name;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: SERVERKEY,
        clientKey: CLIENTKEY,
      });

      let idPayment = Math.floor(Math.random() * 100);

      let parameter = {
        transaction_details: {
          order_id: `${emailUser} - ${nameUser} - ${idPayment}`,
          gross_amount: 50000,
          name: nameUser,
          email_user: emailUser,
        },
        credit_card: {
          secure: true,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json({ TokenPayment: transaction.token });
    } catch (error) {
      next(error);
    }
  }

  static async changeRole(req, res, next) {
    try {
      const { id } = req.user;
      const { role } = req.body;

      const updateStatus = await User.update(
        { role },
        {
          where: {
            id,
          },
        }
      );

      if (updateStatus[0] === 1) {
        res.status(200).json({ message: "You are Premium Now" });
      } else {
        throw { name: "Error patch role" };
      }
    } catch (error) {
      next(error);
    }
  }

  static async getstat(req, res, next) {
    try {
      const useranswers = await Answer.findAll({
        where: {
          UserId: req.user.id,
        },
      });
      let jumlahBenar = 0;
      let jumlah = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      let benar = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      for (let element of useranswers) {
        if (element.userAnswer !== "") {
          const question = await Question.findByPk(element.QuestionId);
          const answer = await QuestionKey.findByPk(+element.userAnswer);
          jumlah[question.subject]++;
          if (answer.correct === true) {
            jumlahBenar++;
            benar[question.subject]++;
          }
        }
      }
      const perPU = (benar["PU"] / jumlah["PU"]) * 100;
      const perPPU = (benar["PPU"] / jumlah["PPU"]) * 100;
      const perPK = (benar["PK"] / jumlah["PK"]) * 100;
      const perPBM = (benar["PBM"] / jumlah["PBM"]) * 100;
      const perAll = (jumlahBenar / useranswers.length) * 100;
      res.status(200).json({
        jumlahBenar,
        jumlahSoal: useranswers.length,
        perPU: perPU ? perPU : 0,
        perPPU: perPPU ? perPPU : 0,
        perPK: perPK ? perPK : 0,
        perPBM: perPBM ? perPBM : 0,
        perAll: perAll ? perAll : 0,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    const t = await sequelize.transaction();
    try {
      await User.update(
        { name: req.body.name },
        {
          where: {
            id: req.user.id,
          },
          transaction: t,
        }
      );
      for (let data of req.body.major) {
        await UserMajor.update(
          {
            MajorId: data.MajorId,
          },
          {
            where: {
              id: data.UserMajorId,
            },
            transaction: t,
          }
        );
      }
      t.commit();
      res.status(200).json({ message: "Success" });
    } catch (err) {
      t.rollback();
      next(err);
    }
  }

  static async getTaskStat(req, res, next) {
    try {
      const todos = await Todo.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [{ model: Task, include: [Chapter] }],
      });
      let jumlahDone = 0;
      let jumlahtodos = todos.length;
      let jumlah = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      let done = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      for (let data of todos) {
        jumlah[data.Task.Chapter.subject]++;
        if (data.status === true) {
          jumlahDone++;
          done[data.Task.Chapter.subject]++;
        }
      }
      const perPU = (done["PU"] / jumlah["PU"]) * 100;
      const perPPU = (done["PPU"] / jumlah["PPU"]) * 100;
      const perPK = (done["PK"] / jumlah["PK"]) * 100;
      const perPBM = (done["PBM"] / jumlah["PBM"]) * 100;
      const perAll = (jumlahDone / jumlahtodos) * 100;
      res.status(200).json({
        jumlahtodos,
        jumlahDone,
        perPU: perPU ? perPU : 0,
        perPPU: perPPU ? perPPU : 0,
        perPK: perPK ? perPK : 0,
        perPBM: perPBM ? perPBM : 0,
        perAll: perAll ? perAll : 0,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserAnswerHistory(req, res, next) {
    try {
      const useranswers = await Answer.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [
          { model: Question, include: [{ model: QuestionKey }] },
          QuestionKey,
        ],
      });
      res.status(200).json(useranswers);
    } catch (err) {
      next(err);
    }
  }

  static async getTryOutStat(req, res, next) {
    try {
      const useranswers = await AnswerWeeklyTest.findAll({
        where: {
          UserId: req.user.id,
        },
      });
      let jumlahBenar = 0;
      let jumlah = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      let benar = {
        PU: 0,
        PPU: 0,
        PK: 0,
        PBM: 0,
      };
      for (let element of useranswers) {
        if (element.userAnswer !== "") {
          const question = await QuestionWeeklyTest.findByPk(
            +element.QuestionWeeklyTestId
          );
          const answer = await QuestionKeyWeeklyTest.findByPk(
            +element.userAnswer
          );
          jumlah[question.subject]++;
          if (answer.correct === true) {
            jumlahBenar++;
            benar[question.subject]++;
          }
        }
      }
      const perPU = (benar["PU"] / jumlah["PU"]) * 100;
      const perPPU = (benar["PPU"] / jumlah["PPU"]) * 100;
      const perPK = (benar["PK"] / jumlah["PK"]) * 100;
      const perPBM = (benar["PBM"] / jumlah["PBM"]) * 100;
      const perAll = (jumlahBenar / useranswers.length) * 100;
      res.status(200).json({
        jumlahBenar,
        jumlahSoal: useranswers.length,
        perPU: perPU ? perPU : 0,
        perPPU: perPPU ? perPPU : 0,
        perPK: perPK ? perPK : 0,
        perPBM: perPBM ? perPBM : 0,
        perAll: perAll ? perAll : 0,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserTryOutAnswerHistory(req, res, next) {
    try {
      const useranswers = await AnswerWeeklyTest.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [
          {
            model: QuestionWeeklyTest,
            include: [{ model: QuestionKeyWeeklyTest }],
          },
          QuestionKeyWeeklyTest,
        ],
      });
      res.status(200).json(useranswers);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  userController,
};
