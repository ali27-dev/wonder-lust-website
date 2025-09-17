const express = require("express");
const router = express.Router();
/////////////////////////////
/////////POST-INDEX//////////

router.get("/", (req, res) => {
  res.send("post Route");
});
router.get("/:id", (req, res) => {
  res.send("GET posts Ids");
});
router.post("/", (req, res) => {
  res.send("Post users");
});
router.delete("/:id", (req, res) => {
  res.send("Delete Users");
});

module.exports = router;
