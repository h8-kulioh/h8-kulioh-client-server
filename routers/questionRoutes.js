const express = require("express")
const router = express.Router()
const {questionController} = require("../controllers/question")
const { authentif } = require("../middleware/authentif")



router.use(authentif)

router.use('/daily', questionController.getQuestionDaily)

module.exports = router