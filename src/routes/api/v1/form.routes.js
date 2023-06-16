const router = require("express").Router();
const formController = require("../../../controllers/form.controller");

router.get("/:full_access/:username", formController.getFormList);

router.post("/batch", formController.batchApprove);

module.exports = router;
