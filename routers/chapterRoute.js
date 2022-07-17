const express = require("express");
const router = express.Router();
const { ChapterController } = require("../controllers/chapters");
const { authentif } = require("../middleware/authentif")

router.use(authentif)

router.get("/chapters", ChapterController.getChapters);

module.exports = router;
