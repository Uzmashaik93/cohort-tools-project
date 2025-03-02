const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user.model");

const isAuthenticated = require("../middleware/jwt.middleware")
const router = express.Router();
const saltRounds = 10;


// POST  /auth/signup
// ...
router.post("/auth/signup", (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }


User.findOne({ email }).then((foundUser) => {
  if (foundUser) {
    res.status(400).json({ message: "User already exists." });
    return;
  }
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = {
    email: email,
    password: hashedPassword,
    name: name,
  };

  return User.create(newUser);
})
.then((createdUser) => {
    const { email, name, _id } = createdUser;

    const user = {email, name, _id};

    res.status(201).json({ user: user });
})

.catch(err => {
    console.log("Error trying to create an account...\n\n", err);
    res.status(500).json({ message: "Internal Server Error" })
  });
});

// POST  /auth/login
// ...

router.post('/auth/login', (req, res, next) => {
    const {email, password } = req.body;
    if ( !email || !password ) {
        res.status(400).json({ message: "Provide email and password." });
        return;
      }
    // Check the users collection if a user with the same email exists
  User.findOne({ email })
  .then((foundUser) => {

    if (!foundUser) {
      // If the user is not found, send an error response
      res.status(401).json({ message: "User not found." })
      return;
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {

      // Deconstruct the user object to omit the password
      const { _id, email, name } = foundUser;

      // Create an object that will be set as the token payload
      const payload = { _id, email, name };

      // Create and sign the token
      const authToken = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: "6h" }
      );

      // Send the token as the response
      res.json({ authToken: authToken });
    }
    else {
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }
  })
  .catch(err => {
    console.log("Error trying to login...\n\n", err);
    res.status(500).json({ message: "Internal Server Error" })
  });
});



// GET /auth/verify (Verify a JWT)
//
router.get('/verify',  (req, res, next) => {
    res.send(isAuthenticated,)
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
   
    // Send back the object with user data
    // previously set as the token payload
    res.json(req.payload);
  });

module.exports = router;
