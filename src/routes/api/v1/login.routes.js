const router = require("express").Router();
const loginController = require("../../../controllers/login.controller");

router.post("/", loginController.validateUser);
module.exports = router;
