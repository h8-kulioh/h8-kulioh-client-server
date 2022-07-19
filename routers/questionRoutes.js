const express = require("express");
const router = express.Router();
const { questionController } = require("../controllers/question");
const { authentif } = require("../middleware/authentif");
const errorHandler = require("../middleware/errorHandler");

router.use(authentif);

router.get("/daily", questionController.getQuestionDaily);
router.post("/answers/daily", questionController.postAnswersDaily);
router.get("/answers/daily/:YYYYMMDD", questionController.getAnswersDailyByDate);

router.use(errorHandler)

module.exports = router;


