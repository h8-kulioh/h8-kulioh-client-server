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

  static async getUniversityById(req, res, next) {
    try {
      const { id } = req.params;

      const getUniversityById = await University.findByPk(id);

      if(getUniversityById === null){
        throw({name: "University not found"})
      }

      res.status(200).json(getUniversityById);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  UniversityController,
};
