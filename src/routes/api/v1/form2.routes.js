const router = require("express").Router();
const form2Controller = require("../../../controllers/form2.controller");

router.get("/:form_id", form2Controller.getFormDetails);

router.post("/", form2Controller.insertFormDetails);

router.patch("/", form2Controller.updateFormStatus);

module.exports = router;
