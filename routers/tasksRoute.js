const express = require("express");
const router = express.Router();
const { TaskController } = require("../controllers/tasks");
const { authentif } = require("../middleware/authentif");
const errorHandler = require("../middleware/errorHandler");

router.use(authentif);

router.get("/tasks", TaskController.getTasks);

router.use(errorHandler)

module.exports = router;
