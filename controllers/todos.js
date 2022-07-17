const { Task, Chapter, Todo, User } = require("../models/index");

class TodoController {
  static async getTodos(req, res, next) {
    try {
      const UserId = req.user.id;
      const getTodos = await Todo.findAll({
        include: [
          {
            model: Task,
            required: true,
            include: [Chapter],
          },
          User,
        ],
        where: {
          UserId,
        },
      });

      res.status(200).json(getTodos);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = {
  TodoController,
};
