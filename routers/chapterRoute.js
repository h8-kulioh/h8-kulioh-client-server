const express = require("express");
const router = express.Router();
const { ChapterController } = require("../controllers/chapters");

router.get("/chapters", ChapterController.getChapters);

module.exports = router;
