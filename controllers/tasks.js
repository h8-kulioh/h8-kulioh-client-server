const { Task, Chapter } = require("../models/index");

class TaskController {
  static async getTasks(req, res, next) {
    try {
      const getTasks = await Task.findAll({
        include: [Chapter]
      });

      res.status(200).json(getTasks);
    } catch (error) {
      console.log(error);
    }
  }
  static async getChapter(req, res, next) {
    try {
      const getChapters = await Chapter.findAll({})
      res.status(200).json(getChapters)
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  TaskController,
};
