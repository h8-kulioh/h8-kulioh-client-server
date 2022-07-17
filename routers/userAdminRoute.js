const express = require("express");
const router = express.Router();
const { UserAdminController } = require("../controllers/userAdmin");
const { authentif } = require("../middleware/authentif");

router.post("/register", UserAdminController.register);
router.post("/login", UserAdminController.login);

router.use(authentif)

router.post("/daily-questions", UserAdminController.createDailyQuestions);
router.put("/daily-questions/:id", UserAdminController.updateDailyQuestions);




module.exports = router;
