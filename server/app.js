const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const User = require("./models/user.model");
const Cohort = require("./models/cohort.model");
const Student = require("./models/student.model");

const {errorHandler, notFoundHandler} = require ("./middleware/error-handling");

const authRouter = require("./routes/auth.routes"); 
const usersRoutes = require ("./routes/users.routes");
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
app.use("/auth", authRouter);
app.use("/api/users", usersRoutes)   
// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then((cohortsFromDb) => {
      res.status(200).json(cohortsFromDb);
    })
    .catch((e) => next(e));
});

app.get("/api/students", (req, res, next) => {
  Student.find()
    .populate("cohort")
    .then((studentsFromDb) => {
      res.status(200).json(studentsFromDb);
    })
    .catch(error => {
      next(error);
    });
});

app.post("/api/students", (req, res, next) => {
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
      res.status(200).json(newStudent);
    })
    .catch((e) => next(e));
});

app.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((e) => next(e));
});

app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((studentsCohort) => {
      res.status(200).json(studentsCohort);
    })
    .catch((e) => next(e));
});

app.put("/api/students/:studentId", (req, res, next) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body)
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((e) => next(e));
});

app.delete("/api/students/:studentId", (req, res, next) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((e) => next(e));
});

app.post("/api/cohorts", (req, res, next) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((newCohort) => {
      res.status(200).json(newCohort);
    })
    .catch((e) => next(e));
});

app.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;

  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((e) => next(e));
});

app.put("/api/cohorts/:cohortId", (req, res, next) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body)
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((e) => next(e));
});

app.delete("/api/cohorts/:cohortId", (req, res, next) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((e) => next(e));
});


app.use(notFoundHandler);
app.use(errorHandler);
// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

