const router = require("express").Router();

router.post("/", (req, res) => {
  res.send("WELCOME!");
});
module.exports = router;
