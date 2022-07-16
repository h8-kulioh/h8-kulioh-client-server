const { University } = require("../models/index");

class UniversityController {
  static async getUniversity(req, res, next) {
    try {
      const { name } = req.query;

      let options = {
        where: {},
      };

      if (name) {
        options.where = {
          name,
        };
      }
      const getUniversity = await University.findAll(options);

      res.status(200).json(getUniversity);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  UniversityController,
};
