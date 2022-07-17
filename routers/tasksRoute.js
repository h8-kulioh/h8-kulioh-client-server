const express = require("express");
const router = express.Router();
const { TaskController } = require("../controllers/tasks");
const { authentif } = require("../middleware/authentif");

router.use(authentif);

router.get("/tasks", TaskController.getTasks);

module.exports = router;
