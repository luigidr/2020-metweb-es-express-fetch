class App {

    constructor(examContainer, sidebarContainer) {
        // reference to the the exam container (HTML element)
        this.examContainer = examContainer;

        // init the exam manager and get the exam list
        this.examManager = new ExamManager();
        this.exams = this.examManager.getPassedExams();

        // init the filter functionality
        this.filters = new Filters(sidebarContainer, this.examManager);
        // listening for the event generated by filters
        document.addEventListener('filter-selected', this.onFilterSelected);

        // init the form
        const addForm = document.getElementById('add-form');
        this.initForm(addForm);

        // finally, show all the exams (default)
        this.showExams(this.exams);
    }

    /**
     * Init the "add exam" form and set up its callback
     * 
     * @param {*} form the HTML element representing the form
     */
    initForm(form) {
        // init courses
        const courses = this.examManager.getCourses();
        courses.forEach((c) => {
            form.course.appendChild(new Option(c.name, c.code));
        });
        
        // change credits according to the selected course
        form.course.addEventListener('change', function() {
            const selectedCourse = form.course.options[form.course.selectedIndex]; 
            form.credits.value = courses.find(course => course.name === selectedCourse.text).credits;
        });

        // set up form callback
        form.addEventListener('submit', this.onFormSubmitted);
    }

    /**
     * Custom event handler: receive and show the filtered exam list
     * @param {*} event 
     */
    onFilterSelected = (event) => {
        // show all the things!
        this.showExams(event.detail);
    }

    onFormSubmitted = (event) => {
        event.preventDefault();
        const form = event.target;
        const selectedCourse = form.course.options[form.course.selectedIndex];

        if(form.checkValidity()) {
            const exam = new Exam(selectedCourse.value, selectedCourse.text, form.credits.value, form.date.value, form.score.value);

            this.examManager.addExam(exam);
            const exams = this.examManager.getPassedExams();

            // refresh the user interface
            this.showExams(exams);

            //reset the form and close the modal
            form.reset();
            document.getElementById('close-modal').click();
        }
    }

    /**
     * Create the HTML table for showing the exams
     * @param {*} exams 
     */
    showExams(exams) {
        // empty the exam table
        if(this.examContainer.innerHTML !== '') {
            this.examContainer.innerHTML = '';
        }

        for(let exam of exams) {
            const tr = document.createElement('tr');

            const tdDate = document.createElement('td');
            tdDate.innerText = exam.date.format('DD/MM/YYYY');

            const tdName = document.createElement('td');
            tdName.innerText = exam.name;

            const tdCredits = document.createElement('td');
            tdCredits.innerText = exam.credits;

            const tdGrade = document.createElement('td');
            tdGrade.innerText = exam.score;

            tr.appendChild(tdDate);
            tr.appendChild(tdName);
            tr.appendChild(tdCredits);
            tr.appendChild(tdGrade);
            this.examContainer.appendChild(tr);
        }
    }
}