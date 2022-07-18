const express = require("express");
const router = express.Router();
const { QuestionWeeklyController } = require("../controllers/questionWeekly");
const { authentif } = require("../middleware/authentif");

router.use(authentif);
router.get("/weekly/:YYYYMMDD", QuestionWeeklyController.getQuestionWeekly);
router.post("/user-answer", QuestionWeeklyController.postAnswersWeekly);
router.get("/user-answer", QuestionWeeklyController.getAnswersWeekly);




module.exports = router;


