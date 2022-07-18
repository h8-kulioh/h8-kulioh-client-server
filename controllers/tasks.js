const { Task, Chapter } = require("../models/index");

class TaskController {
  static async getTasks(req, res, next) {
    try {
      const getTasks = await Task.findAll({
        include: [Chapter]
      });

      res.status(200).json(getTasks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  TaskController,
};
