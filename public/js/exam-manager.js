class ExamManager {
    
    constructor() {
        this.exams = [
            new Exam('MF0034', 'Algoritmi I', 9, '2020-02-01', '28'),
            new Exam('MF0158', 'Basi di dati e sistemi informativi', 6, '2020-02-06', '30'),
            new Exam('MF0363', 'Paradigmi di programmazione', 9, '2020-02-15','26'),
            new Exam('MF0054', 'Algoritmi II', 9, '2019-09-10', '27'),
        ];
    }

    /**
     * Build the list of my exams
     */
    getPassedExams() {
        return this.exams;
    }

    /**
     * Add a new exam to the list
     * @param {Exam} exam 
     */
    addExam(exam) {
        this.exams.push(exam);
    }

    /**
     * Get the list of courses for which exams are available
     */
    getCourses() {
        return [
            {name: "Metodologie di programmazione per il web", code: "MF0163", credits: 6},
            {name: "Reti I", code: "S1609", credits: 6},
        ];
    }

    /**
     * Return a filtered array, with only the exams done in a specific year
     * @param {*} year 
     */
    getByYear(year) {
        return this.exams.filter(ex => ex.date.isBetween(year+'-01-01', year+'-12-31', undefined, []));
    }
}