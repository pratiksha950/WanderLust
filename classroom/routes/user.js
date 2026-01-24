const express = require("express");
const router=express.Router()


// index users
router.get("/", (req, res) => {
  res.send("get for users");
});

//users show route
router.get("/:id", (req, res) => {
  res.send("get for user id");
});

//users post
router.post("/", (req, res) => {
  res.send("post for rows");
});

// delete user
router.delete("/:id", (req, res) => {
  res.send("delete user for id");
});


module.exports=router;
