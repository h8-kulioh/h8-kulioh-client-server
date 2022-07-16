const express = require("express");
const router = express.Router();
const { MajorController } = require("../controllers/majors");

router.get("/major", MajorController.getMajor);

module.exports = router;
