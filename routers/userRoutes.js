const express = require("express")
const router = express.Router()
const {userController} = require("../controllers/user")

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/profile", userController.getAllProfile)



module.exports = router