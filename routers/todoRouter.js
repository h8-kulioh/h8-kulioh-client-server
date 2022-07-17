const express = require("express");
const router = express.Router();
const { TodoController } = require("../controllers/todos");
const { authentif } = require("../middleware/authentif")

router.use(authentif)
router.get("/todos", TodoController.getTodos);

module.exports = router;
