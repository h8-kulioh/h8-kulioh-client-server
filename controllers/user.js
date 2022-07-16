const {
  verifiedPass,
  createToken,
  hashPass,
} = require("../helpers/jwt&bcrypt");
const { User, UserMajor, sequelize, Major } = require("../models/index");
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
      const usermajor = req.body.major.map(MajorId=>{
        return {
          UserId: newUser.id,
          MajorId
        }
      })
      await UserMajor.bulkCreate(usermajor)

      const result = {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      };
      t.commit()
      res.status(201).json(result);
    } catch (error) {
      t.rollback()
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

  static async getProfile(req, res, next) {
    try {
      const { id } = req.user;
      const allUser = await User.findByPk(id,{
        include: [Major]
      });
      res.status(200).json(allUser);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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

      console.log(nameUser);

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
          order_id: `${email}- ${name} - ${idPayment}`,
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
      console.log(error);
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
      console.log(error);
    }
  }
}

module.exports = {
  userController,
};
