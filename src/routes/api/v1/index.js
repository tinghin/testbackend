const router = require("express").Router();

router.use("/greeting", require("./greeting.routes"));
router.use("/form", require("./form.routes"));
router.use("/form1", require("./form1.routes"));
router.use("/form2", require("./form2.routes"));
router.use("/login", require("./login.routes"));

module.exports = router;
