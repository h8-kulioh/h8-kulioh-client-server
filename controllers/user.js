const {
  verifiedPass,
  createToken,
  hashPass,
} = require("../helpers/jwt&bcrypt");
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

  static async getProfile(req, res, next) {
    try {
      const { id } = req.user;
      const allUser = await User.findByPk(id);
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
          id
        }
      })

      res.status(200).json(editProfile);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  userController,
};
