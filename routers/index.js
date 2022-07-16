const express = require("express")
const router = express.Router()

const users = require("./userRoutes")
const questions = require("./questionRoutes")
const majors = require("./majorRoutes")

router.use("/majorsroute", majors)
router.use("/users", users)
router.use("/questions", questions)

module.exports = router