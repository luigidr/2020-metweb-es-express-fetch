'use strict';

// DAO (Data Access Object) module for accessing course and exams

const sqlite = require('sqlite3');
const db = new sqlite.Database('exams.db', (err) => {
  if (err) throw err;
});

exports.getAllCourses = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const courses = rows.map((e) => ({code: e.code, name: e.name, credits: e.CFU}));
      resolve(courses);
    });
  });
};

exports.getCourseByCode = function(code) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (row === undefined) {
        resolve({error: 'Course not found.'});
      } else {
        const course = {code: row.code, name: row.name, credits: row.CFU};
        resolve(course);
      }
    });
  });
};

exports.getAllExams = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT course_code, score, date, name, id FROM exam, course WHERE course_code=code';

    // execute the query and get all the results into 'rows'
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // transform 'rows' (query results) into an array of objects
      const exams = rows.map((e) => (
        {
          code: e.course_code,
          score: e.score,
          date: e.date,
          name: e.name,
          id: e.id,
        }
      ));
      resolve(exams);
    });
  });
};

exports.createExam = function(exam) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exam(course_code, date, score) VALUES (?, DATE(?), ?)';
    db.run(sql, [exam.code, exam.date, exam.score], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};
