const express = require("express")
const router = express.Router()

const users = require("./userRoutes")

router.use("/users", users)

module.exports = router