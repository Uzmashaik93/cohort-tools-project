const express = require("express");
const User = require("../models/user.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const router = express.Router();


router.get("/:userId", isAuthenticated, (req, res, next) => {
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