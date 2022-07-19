const {
  QuestionWeeklyTest,
  QuestionKeyWeeklyTest,
  Answer,
  User,
  AnswerWeeklyTest,
} = require("../models");

class QuestionWeeklyController {
  static async getQuestionWeekly(req, res, next) {
    try {
      const { YYYYMMDD } = req.params;
      const questions = await QuestionWeeklyTest.findAll({
        include: [QuestionKeyWeeklyTest],
      });

      let findByDate = questions.filter((el) => el.releaseDate === YYYYMMDD);

      res.status(200).json(findByDate);
    } catch (err) {
      next(err);
    }
  }

  static async postAnswersWeekly(req, res, next) {
    try {
      const { userAnswer, QuestionWeeklyTestId } = req.body;

      let insertData = userAnswer.map((el, i) => {
        return {
          userAnswer: el,
          QuestionWeeklyTestId: QuestionWeeklyTestId[i],
          UserId: req.user.id,
        };
      });

      const result = await AnswerWeeklyTest.bulkCreate(insertData);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAnswersWeekly(req, res, next) {
    try {
      const UserId = req.user.id;

      const getAnswersWeekly = await AnswerWeeklyTest.findAll(
        { include: [User, QuestionWeeklyTest] },
        {
          where: {
            UserId,
          },
        }
      );
      res.status(200).json(getAnswersWeekly);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = {
  QuestionWeeklyController,
};
