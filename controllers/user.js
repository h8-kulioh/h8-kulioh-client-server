const { verifiedPass, createToken } = require("../helpers/jwt&bcrypt");
const { User } = require("../models/index");

class userController {
  static async register(req, res, next) {
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

      const result = {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
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

  static async getAllProfile(req, res, next) {
    try {
      const allUser = await User.findAll();
      res.status(200).json(allUser);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  userController,
};
