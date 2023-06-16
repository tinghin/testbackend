const router = require("express").Router();
const form1Controller = require("../../../controllers/form1.controller");

router.get("/:form_id", form1Controller.getFormDetails);

router.post("/", form1Controller.insertFormDetails);

router.patch("/", form1Controller.updateFormDetails);

router.patch("/status", form1Controller.updateFormStatus);

module.exports = router;
