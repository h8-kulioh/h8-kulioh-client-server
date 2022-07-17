const express = require("express");
const router = express.Router();
const { UserAdminController } = require("../controllers/userAdmin");
const { authentif } = require("../middleware/authentif");

router.post("/register", UserAdminController.register);
router.post("/login", UserAdminController.login);


module.exports = router;
