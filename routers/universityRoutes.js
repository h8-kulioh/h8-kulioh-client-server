const express = require("express");
const router = express.Router();
const { UniversityController } = require("../controllers/universities");

router.get("/university", UniversityController.getUniversity);

module.exports = router;
