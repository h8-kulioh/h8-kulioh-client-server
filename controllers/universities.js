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

      if(getUniversity.length === 0){
        throw({name: "University not found"})
      }

      res.status(200).json(getUniversity);
    } catch (error) {
      next(error);
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
      next(error);
    }
  }
}

module.exports = {
  UniversityController,
};
