const express = require("express");
const router = express.Router();
const { QuestionWeeklyController } = require("../controllers/questionWeekly");
const { authentif } = require("../middleware/authentif");

router.use(authentif);

router.get("/weekly/:YYYYMMDD", QuestionWeeklyController.getQuestionWeekly);



module.exports = router;


