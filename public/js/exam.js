class Exam {

    static counter = 0;

    constructor(code, name, credits, date, score) {
        this.id = Exam.counter++;
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.date = moment(date);
        this.score = score;
    }
}