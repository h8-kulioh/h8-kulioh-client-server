const {
  QuestionWeeklyTest,
  QuestionKeyWeeklyTest,
  Answer,
  User,
} = require("../models");

class QuestionWeeklyController {
  static async getQuestionWeekly(req, res, next) {
    try {
      const { YYYYMMDD } = req.params;
      const questions = await QuestionWeeklyTest.findAll({
        include: [QuestionKeyWeeklyTest],
      });

      function changeDate(dateInput) {
        return new Date(dateInput)
          .toISOString()
          .split("T")[0]
          .split("-")
          .join("");
      }

      let findByDate = questions.filter(
        (el) => 
         changeDate(el.releaseDate) === YYYYMMDD
      );

      res.status(200).json(findByDate);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  QuestionWeeklyController,
};
