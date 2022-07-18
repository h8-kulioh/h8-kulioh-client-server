const express = require("express");
const router = express.Router();
const { MajorController } = require("../controllers/majors");
const errorHandler = require("../middleware/errorHandler");

router.get("/major", MajorController.getMajor);

router.use(errorHandler)

module.exports = router;
