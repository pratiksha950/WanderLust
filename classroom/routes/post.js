const express = require("express");
const router=express.Router()


// index users
router.get("/", (req, res) => {
  res.send("get for posts");
});

// show route
router.get("/:id", (req, res) => {
  res.send("get for posts id");
});

// post
router.post("/", (req, res) => {
  res.send("post for rows");
});

// delete
router.delete("/:id", (req, res) => {
  res.send("Hi delete posts for id");
});

module.exports = router; 