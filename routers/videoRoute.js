const express = require("express");
const router = express.Router();
const { VideoController } = require("../controllers/video");
const { authentif } = require("../middleware/authentif");
const errorHandler = require("../middleware/errorHandler");

router.use(authentif)
router.get("/daily", VideoController.getVideo);
router.get("/weekly", VideoController.getVideoWeekly);


router.use(errorHandler)

module.exports = router;
