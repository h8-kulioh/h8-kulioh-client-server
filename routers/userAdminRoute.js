const express = require("express");
const router = express.Router();
const { UserAdminController } = require("../controllers/userAdmin");
const { authentif } = require("../middleware/authentif");
const { authors } = require("../middleware/authorization");
const errorHandler = require("../middleware/errorHandler");

router.post("/register", UserAdminController.register);
router.post("/login", UserAdminController.login);

router.use(authentif);

router.post(
  "/weekly-questions",
  authors,
  UserAdminController.createWeeklyQuestions
);

router.use(errorHandler);

module.exports = router;
