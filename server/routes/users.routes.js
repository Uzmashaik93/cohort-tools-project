const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/:userId", (req, res, next) => {
    res.send(isAuthenticated,)
    const { userId } = req.params;
  
    User.findById(userId)
      .then((userFromDb) => {
        if (!userFromDb) {
            res.status(404).json({ message : "User not found"});
        }
        res.status(200).json(userFromDb);
      })
      .catch((e) => {
        res.status(500).json({ message: "Error" });
      });
  });

  module.exports = router