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
  Chapter
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

  static async editProfile(req, res, next) {
    try {
      const { id } = req.user;
      let { email, password, name } = req.body;

      if (!email) {
        throw { name: "Email is required" };
      }

      if (!password) {
        throw { name: "Password is required" };
      }

      if (!name) {
        throw { name: "Name is required" };
      }

      password = hashPass(password);
      const insertData = { email, password, name };

      const editProfile = await User.update(insertData, {
        where: {
          id,
        },
      });

      res.status(200).json(editProfile);
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

      const { email, name } = req.body;

      const emailUser = req.user.email;
      const nameUser = req.user.name;

      if (email !== emailUser) {
        throw { name: "Your email can't be different" };
      }

      if (name !== nameUser) {
        throw { name: "Your name can't be different" };
      }

      if (!name) {
        throw { name: "Name is required" };
      }

      if (!email) {
        throw { name: "Email is required" };
      }

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: SERVERKEY,
        clientKey: CLIENTKEY,
      });

      let idPayment = Math.floor(Math.random() * 100);

      let parameter = {
        transaction_details: {
          order_id: `${email} - ${name} - ${idPayment}`,
          gross_amount: 50000,
          name: name,
          email_user: email,
        },
        credit_card: {
          secure: true,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      if (!transaction) {
        throw { name: "Transaction failed" };
      }

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
      let PU = 0;
      let PUbenar = 0;
      let PPU = 0;
      let PPUbenar = 0;
      let PK = 0;
      let PKbenar = 0;
      let PBM = 0;
      let PBMbenar = 0;
      for (let element of useranswers) {
        if (element.userAnswer !== "") {
          const question = await Question.findByPk(element.QuestionId);
          const answer = await QuestionKey.findByPk(+element.userAnswer);
          switch (question.subject) {
            case "PU":
              PU += 1;
              if (answer.correct === true) {
                jumlahBenar += 1;
                PUbenar += 1;
              }
              break;
            case "PPU":
              PPU += 1;
              if (answer.correct === true) {
                jumlahBenar += 1;
                PPUbenar += 1;
              }
              break;
            case "PK":
              PK += 1;
              if (answer.correct === true) {
                jumlahBenar += 1;
                PKbenar += 1;
              }
              break;
            case "PBM":
              PBM += 1;
              if (answer.correct === true) {
                jumlahBenar += 1;
                PBMbenar += 1;
              }
              break;
          }
        }
      }
      res.status(200).json({
        jumlahBenar,
        jumlahSoal: useranswers.length,
        perPU: (PUbenar / PU) * 100,
        perPPU: (PPUbenar / PPU) * 100,
        perPK: (PKbenar / PK) * 100,
        perPBM: (PBMbenar / PBM) * 100,
        perAll: (jumlahBenar / useranswers.length) * 100,
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
          }
        );
      }
      t.commit()
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      t.rollback()
      next(err)
    }
  }

  static async getTaskStat(req, res, next) {
    try {
      const todos = await Todo.findAll({
        where: {
          UserId: req.user.id
        },
        include: [{ model: Task, include: [Chapter] }]
      })
      let jumlahDone = 0
      let jumlahtodos = todos.length
      let PU = 0
      let PUdone = 0
      let PPU = 0
      let PPUdone = 0
      let PK = 0
      let PKdone = 0
      let PBM = 0
      let PBMdone = 0
      for (let data of todos) {
        switch (data.Task.Chapter.subject) {
          case "PU":
            PU += 1;
            if (data.status === true) {
              jumlahDone += 1;
              PUdone += 1;
            }
            break;
          case "PPU":
            PPU += 1;
            if (data.status === true) {
              jumlahDone += 1;
              PPUdone += 1;
            }
            break;
          case "PK":
            PK += 1;
            if (data.status === true) {
              jumlahDone += 1;
              PKdone += 1;
            }
            break;
          case "PBM":
            PBM += 1;
            if (data.status === true) {
              jumlahDone += 1;
              PBMdone += 1;
            }
            break;
        }
      };
      res.status(200).json({
        jumlahtodos,
        jumlahDone,
        perPU: (PUdone / PU) * 100,
        perPPU: (PPUdone / PPU) * 100,
        perPK: (PKdone / PK) * 100,
        perPBM: (PBMdone / PBM) * 100,
        perAll: (jumlahDone / jumlahtodos) * 100,
      })
    } catch (err) {
      next(err)
    }
  }

  static async getUserAnswerHistory(req, res, next) {
    try {
      const useranswers = await Answer.findAll({
        where: {
          UserId: req.user.id
        },
        include: [{ model: Question, include: [{ model: QuestionKey }] }, QuestionKey]
      })
      res.status(200).json(useranswers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  userController,
};
