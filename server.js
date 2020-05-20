// imports
const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao.js');

// init
const app = express();
const port = 3000;

// set up the middleware
app.use(morgan('tiny'));

// every requests body will be considered as in JSON format
app.use(express.json());

// set up the 'client' component as a static website
app.use(express.static('public'));
app.get('/', (req, res) => res.redirect('/index.html'));

// === REST API (course, exam) === //

// GET /courses
// Get all courses
// Request body: empty
// Response body: array of objects representing all the courses
app.get('/courses', (req, res) => {
  dao.getAllCourses()
  .then((courses) => res.json(courses))
  .catch(() => res.status(500).end());
});


// GET /courses/:code
// Get a course, given its code
// Request body: empty
// Example: GET /courses/MF0158
// Response body: { "code": "MF0158", "name": "Basi di dati e sistemi informativi", "CFU": 9 }
// Error: 404, {"error": "Course not found."}
app.get('/courses/:code', (req, res) => {
  dao.getCourseByCode(req.params.code)
  .then((course) => res.json(course))
  .catch((error) => res.status(404).json(error));
});

// GET /exams
// Get all the exams
app.get('/exams', (req, res) => {
  dao.getAllExams()
  .then((exams) => res.json(exams))
  .catch(() => res.status(500).end());
});

// POST /exams
// Create a new exam
// Request body: { "code": "MF0162", "score": 30, "date": "2020-05-15" }
// Response body: empty (but set the relative path of the new item in the location header)
app.post('/exams', [
  check('score').isInt({min: 18, max: 30}),
  check('code').isLength({min: 5, max: 6}),
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const exam = {
    code: req.body.code,
    score: req.body.score,
    date: req.body.date,
  };
  dao.createExam(exam)
  .then((result) => res.status(201).header('Location', `/exams/${result}`).end())
  .catch((err) => res.status(503).json({ error: 'Database error during the creation'}));
});


// activate the server
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
