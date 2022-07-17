const express = require("express")
const router = express.Router()

const users = require("./userRoutes")
const questions = require("./questionRoutes")
const majors = require("./majorRoutes")
const universities = require("./universityRoutes")
const chapters = require("./chapterRoute")


router.use("/majorsroute", majors)
router.use("/universityroute", universities)
router.use("/users", users)
router.use("/chaptersrouter", chapters)
router.use("/questions", questions)

module.exports = router