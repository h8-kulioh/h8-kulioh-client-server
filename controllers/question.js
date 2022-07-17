const { Question, QuestionKey, Answer, User } = require("../models");

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
      const { userAnswer, QuestionId } = req.body;

      let insertData = userAnswer.map((el, i) => {
        return {
          userAnswer: el,
          QuestionId: QuestionId[i],
          UserId: req.user.id,
        };
      });

      const result = await Answer.bulkCreate(insertData)
      res.status(200).json(result);

    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAnswersDailyByDate(req, res, next) {
    try {
      const { YYYYMMDD } = req.params;
      const UserId = req.user.id;
      let anwersDate = await Answer.findAll({
        include: [User, Question],
        where: {
          UserId,
        },
      });

      function changeDate(dateInput) {
        return new Date(dateInput)
          .toISOString()
          .split("T")[0]
          .split("-")
          .join("");
      }

      let findByDate = anwersDate.filter(
        (el) => changeDate(el.createdAt) === YYYYMMDD
      );

      if (findByDate.length === 0) {
        throw { name: "Answers is not found" };
      }
      res.status(200).json(findByDate);
    } catch (error) {
      // console.log(error);
      res.status(404).json({
        statusCode: 404
      })
    }
  }
}

module.exports = {
  questionController,
};
