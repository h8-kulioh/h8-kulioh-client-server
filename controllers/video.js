const { VideoPremium, Question, WeeklyPremiumVideo, QuestionWeeklyTest } = require("../models/index");

class VideoController {
  static async getVideo(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== "Premium") {
        throw { name: "Premium member only" };
      }

      const getVideo = await VideoPremium.findAll({
        include: [Question],
      });

      res.status(201).json(getVideo);
    } catch (error) {
      next(error);
    }
  }

  static async getVideoWeekly(req, res, next) {
    try {
      const { role } = req.user;
      if (role !== "Premium") {
        throw { name: "Premium member only" };
      }

      const getVideoPremium = await WeeklyPremiumVideo.findAll({
        include: [QuestionWeeklyTest],
      });

      res.status(201).json(getVideoPremium);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { VideoController };
