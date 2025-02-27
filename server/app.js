const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Cohort = require("./models/cohort.model");
const Student = require("./models/student.model");

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
  Cohort.find()
    .then((cohortsFromFDb) => {
      res.json(cohortsFromFDb);
    })
    .catch((e) => res.status(500).json({ e: "Error" }));
});

app.get("/api/students", (req, res) => {
  Student.find()
    .populate("cohort")
    .then((studentsFromFDb) => {
      res.json(studentsFromFDb);
    })
    .catch((e) => res.status(500).json({ e: "Error" }));
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
      res.status(200).json(newStudent);
    })
    .catch((error) => {
      return res.status(500).json({ message: "error!!" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;

  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((studentsCohort) => {
      res.json(studentsCohort);
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body)
    .then((updatedStudent) => {
      res.json(updatedStudent);
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.post("/api/cohorts", (req, res) => {
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
      res.json(newCohort);
    })
    .catch((error) => {
      return res.status(500).json({ message: "error!!" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Cohort.findById(cohortId)
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body)
    .then((updatedCohort) => {
      res.json(updatedCohort);
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
