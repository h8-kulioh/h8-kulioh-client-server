const { Chapter } = require("../models/index");

class ChapterController {
  static async getChapters(req, res, next) {
    try {
      const getChapters = await Chapter.findAll();

      res.status(200).json(getChapters);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  ChapterController,
};
