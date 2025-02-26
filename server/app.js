const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Cohort = require("./models/cohort.model");
const Student = require("./models/student.model");

const cohorts = require("./cohorts.json");
const students = require("./students.json");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.use(
  cors({
    origin: ["http://localhost:5005", "http://example.com"], // Add the URLs of allowed origins to this array
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.get("/api/cohorts", (req, res) => {
  res.json(cohorts);
});
app.get("/api/students", (req, res) => {
  res.json(students);
});
app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
  })
    .then((newStudent) => {
      res.json(newStudent);
    })
    .catch((error) => {
      return res.status(500).json({ message: "error!!" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: error.message });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
