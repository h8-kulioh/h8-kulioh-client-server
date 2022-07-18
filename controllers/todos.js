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
        order: [["id", "ASC"]],
      });

      res.status(200).json(getTodos);
    } catch (error) {
      next(error);
    }
  }

  static async patchTodos(req, res, next) {
    try {
      const UserId = req.user.id;
      const TaskId = req.params.id;

      const { status } = req.body;

      const patchStatus = await Todo.update(
        {
          status,
        },
        {
          where: {
            TaskId,
            UserId,
          },
        }
      );

      if (patchStatus[0] === 1) {
        res.status(200).json({ message: "Your task has been changed" });
      } else {
        throw { name: "Task not found" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  TodoController,
};
