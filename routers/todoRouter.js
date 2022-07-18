const express = require("express");
const router = express.Router();
const { TodoController } = require("../controllers/todos");
const { authentif } = require("../middleware/authentif");
const errorHandler = require("../middleware/errorHandler");

router.use(authentif)
router.get("/todos", TodoController.getTodos);
router.patch("/todos/:id", TodoController.patchTodos);

router.use(errorHandler)

module.exports = router;
