const {User} = require("../models/index")

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
}

module.exports = {
  userController,
};
