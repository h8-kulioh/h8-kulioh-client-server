const express = require("express")
const router = express.Router()
const {userController} = require("../controllers/user")
const { authentif } = require("../middleware/authentif")


router.post("/register", userController.register)
router.post("/login", userController.login)

router.use(authentif)

router.get("/profile", userController.getProfile)
router.put("/profile", userController.updateUser)

router.get("/stat", userController.getstat)
router.get("/taskStat", userController.getTaskStat)

router.post("/handlepayment", userController.handlepayment)
router.patch("/premium", userController.changeRole)








module.exports = router