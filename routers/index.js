const express = require("express")
const router = express.Router()

const users = require("./userRoutes")
const questions = require("./questionRoutes")
const majors = require("./majorRoutes")
const universities = require("./universityRoutes")
const chapters = require("./chapterRoute")
const tasks = require(".//tasksRoute")



router.use("/majorsroute", majors)
router.use("/universityroute", universities)
router.use("/users", users)
router.use("/chaptersroute", chapters)
router.use("/tasksroute", tasks)
router.use("/questions", questions)

module.exports = router