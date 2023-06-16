const router = require("express").Router();

// Run the Middleware
router.use("/eform/api", require("./api"));

router.use("/health", (req, res) => {
  res.end("OK!");
});

module.exports = router;
