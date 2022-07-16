const { Question, QuestionKey, Answer } = require("../models");

class questionController {
  static async getQuestionDaily(req, res, next) {
    try {
      const questions = await Question.findAll({
        where: {
          releaseDay: Math.ceil(
            (new Date().getTime() - new Date(req.user.createdAt).getTime()) /
              (1000 * 3600 * 24)
          ),
        },
        include: [QuestionKey],
      });
      res.status(200).json(questions);
    } catch (err) {
      next(err);
    }
  }

  static async postAnswersDaily(req, res, next) {
    try {
      const questions = await Question.findAll({
        where: {
          releaseDay: Math.ceil(
            (new Date().getTime() - new Date(req.user.createdAt).getTime()) /
              (1000 * 3600 * 24)
          ),
        },
        include: [QuestionKey],
      });

      const QuestionId = questions[0].id;
      const { userAnswer } = req.body;
      const UserId = req.user.id;

      const insertData = { QuestionId, UserId, userAnswer };

      const postAnswersDaily = await Answer.create(insertData);
      res.status(200).json(postAnswersDaily);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = {
  questionController,
};
