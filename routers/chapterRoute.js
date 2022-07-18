const express = require("express");
const router = express.Router();
const { ChapterController } = require("../controllers/chapters");
const { authentif } = require("../middleware/authentif");
const errorHandler = require("../middleware/errorHandler");

router.use(authentif)

router.get("/chapters", ChapterController.getChapters);

router.use(errorHandler)

module.exports = router;
