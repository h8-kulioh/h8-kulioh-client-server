const { Major, University } = require("../models/index");

class MajorController {
  static async getMajor(req, res, next) {
    try {
      const { UniversityId } = req.query;

      let options = {
        include: [University],
        where: {},
      };

      if (UniversityId) {
        options.where = {
          UniversityId,
        };
      }

      const getMajor = await Major.findAll(options);

      if(getMajor.length === 0){
        throw({name: "University not found"})
      }

      res.status(200).json(getMajor);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  MajorController,
};
