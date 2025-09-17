const express = require("express");
const router = express.Router();

/////////////////////////////
/////////GET-USER-INDEX//////////
router.get("/", (req, res) => {
  res.send("root: Hello World!");
});
router.get("/", (req, res) => {
  res.send("User Route");
});
router.get("/:id", (req, res) => {
  res.send("GET user Ids");
});
router.post("/", (req, res) => {
  res.send("Post users");
});
router.delete("/:id", (req, res) => {
  res.send("Delete Users");
});

module.exports = router;
