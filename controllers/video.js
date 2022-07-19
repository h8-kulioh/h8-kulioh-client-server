const { VideoPremium, Question } = require("../models/index");

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
}

module.exports = { VideoController };
