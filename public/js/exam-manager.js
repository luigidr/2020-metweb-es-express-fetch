import Exam from './exam.js';

class ExamManager {
    
    constructor() {
        this.exams = [];
    }

    /**
     * Get the list of my exams
     */
    async getPassedExams() {
        let response = await fetch('/exams');
        const examsJson = await response.json();
        if (response.ok) {
            this.exams = examsJson.map((ex) => Exam.from(ex));
            for (const exam of this.exams){
                let response = await fetch(`/courses/${exam.code}`);
                const courseJson = await response.json();
                if(response.ok) {
                    exam.credits = courseJson.credits;
                }
            }
            return this.exams;
        } else {
            throw examsJson;  // an object with the error coming from the server
        }
    }

    /**
     * Add a new exam to the list
     * @param {Exam} exam 
     */
    addExam(exam) {
        return new Promise((resolve, reject) => {
            fetch('/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exam), // stringify removes undefined fields
            }).then((response) => {
                if(response.ok) {
                    resolve(null);
                } else {
                    // analyze the cause of error
                    response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                      }
            }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
        });
    }

    /**
     * Get the list of courses
     */
    async getCourses() {
        let response = await fetch('/courses');
        const courseJson = await response.json();
        if (response.ok) {
            return courseJson;
        } else {
            throw courseJson;  // an object with the error coming from the server
        }
    }

    /**
     * Return a filtered array, with only the exams done in a specific year
     * @param {*} year 
     */
    getByYear(year) {
        // OPTION 1: filtering the existing exams list, which should be updated periodically
        return this.exams.filter(ex => ex.date.isBetween(year+'-01-01', year+'-12-31', undefined, []));

        // OPTION 2: calling an API, so that you are sure to have the most updated information
    }
}

export default ExamManager;
