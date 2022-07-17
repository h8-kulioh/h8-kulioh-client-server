const express = require("express");
const router = express.Router();
const { TaskController } = require("../controllers/tasks");

router.get("/tasks", TaskController.getTasks);

module.exports = router;
