const express = require("express")
const router = express.Router()
const {userController} = require("../controllers/user")
const {TryOutController} = require("../controllers/tryouthandler")
const { authentif } = require("../middleware/authentif")
const errorHandler = require("../middleware/errorHandler")


router.post("/register", userController.register)
router.post("/login", userController.login)

router.use(authentif)

router.get("/profile", userController.getProfile)
router.put("/profile", userController.updateUser)

router.get("/stat", userController.getstat)
router.get("/tryOutStat", userController.getTryOutStat)
router.get("/taskStat", userController.getTaskStat)
router.get("/allAnswer", userController.getUserAnswerHistory)
router.get("/tryOut/:YYYYMMDD", TryOutController.getUserTryOut)
router.post("/tryOut/:YYYYMMDD", TryOutController.startTryOut)
router.get("/tryOutAllAnswer", userController.getUserTryOutAnswerHistory)

router.post("/handlepayment", userController.handlepayment)
router.patch("/premium", userController.changeRole)


router.use(errorHandler)





module.exports = router