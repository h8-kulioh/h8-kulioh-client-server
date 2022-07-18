const express = require("express");
const router = express.Router();
const { UniversityController } = require("../controllers/universities");
const errorHandler = require("../middleware/errorHandler");

router.get("/university", UniversityController.getUniversity);
router.get("/university/:id", UniversityController.getUniversityById);

router.use(errorHandler)

module.exports = router;
