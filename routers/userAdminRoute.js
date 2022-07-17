const express = require("express");
const router = express.Router();
const { UserAdminController } = require("../controllers/userAdmin");
const { authentif } = require("../middleware/authentif");

router.post("/register", UserAdminController.register);
router.post("/login", UserAdminController.login);

router.use(authentif)

router.post("/daily-questions", UserAdminController.createDailyQuestions);
router.put("/daily-questions/:id", UserAdminController.updateDailyQuestions);
router.delete("/daily-questions/:id", UserAdminController.deleteDailyQuestions);

router.post("/chapter-task", UserAdminController.createChaptersTasks);
router.put("/chapter-task/:id", UserAdminController.updateChaptersTasks);
router.delete("/chapter-task/:id", UserAdminController.deleteChaptersTasks);

router.post("/university-major", UserAdminController.createUniversity);









module.exports = router;
