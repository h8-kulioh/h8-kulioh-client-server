const express = require("express");
const router = express.Router();
const { UserAdminController } = require("../controllers/userAdmin");
const { authentif } = require("../middleware/authentif");
const { authors } = require("../middleware/authorization")


router.post("/register", UserAdminController.register);
router.post("/login", UserAdminController.login);

router.use(authentif)

router.post("/daily-questions", authors, UserAdminController.createDailyQuestions);
router.put("/daily-questions/:id", authors, UserAdminController.updateDailyQuestions);
router.delete("/daily-questions/:id", authors, UserAdminController.deleteDailyQuestions);

router.post("/chapter-task", authors, UserAdminController.createChaptersTasks);
router.put("/chapter-task/:id", authors,  UserAdminController.updateChaptersTasks);
router.delete("/chapter-task/:id", authors, UserAdminController.deleteChaptersTasks);

router.post("/university-major", authors, UserAdminController.createUniversity);
router.put("/university-major/:id", authors, UserAdminController.updateUniversity);
router.delete("/university-major/:id", authors, UserAdminController.deleteUniversity);

router.post("/weekly-questions", authors, UserAdminController.createWeeklyQuestions);












module.exports = router;
