const express = require("express")
const router = express.Router()
const {userController} = require("../controllers/user")
const { authentif } = require("../middleware/authentif")

router.post("/register", userController.register)
router.post("/login", userController.login)

router.use(authentif)

router.get("/profile", userController.getProfile)




module.exports = router