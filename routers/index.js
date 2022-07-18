const express = require("express");
const router = express.Router();

const users = require("./userRoutes");
const questions = require("./questionRoutes");
const questionsWeekly = require("./questionWeeklyRoute");
const majors = require("./majorRoutes");
const universities = require("./universityRoutes");
const chapters = require("./chapterRoute");
const tasks = require("./tasksRoute");
const todos = require("./todoRouter");
const userAdmin = require("./userAdminRoute");

router.use("/majorsroute", majors);
router.use("/universityroute", universities);
router.use("/users", users);
router.use("/users-admin", userAdmin);
router.use("/todoroute", todos);
router.use("/chaptersroute", chapters);
router.use("/tasksroute", tasks);
router.use("/questions", questions);
router.use("/questions-weekly", questionsWeekly);



module.exports = router;
