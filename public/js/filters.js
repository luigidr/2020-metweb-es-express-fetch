class Filters {

    constructor(sidebarContainer, examManager){
        // the reference to the sidebar HTML element
        this.sidebarContainer = sidebarContainer;

        // reference to the exam manager
        this.examManager = examManager;

        // add an event listener (click) for each link in the left sidebar
        this.sidebarContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.onYearSelected);
        });
    }

    /**
     * The 'click' event handler
     * @param {*} event
     */
    onYearSelected = (event) => {
        // the HTML element that was clicked
        const el = event.target;
        // the 'data-id' property of that element
        const filterType = el.dataset.id;
        // removing and adding the 'active' class
        this.sidebarContainer.querySelector('a.active').classList.remove('active');
        el.classList.add('active');

        // properly fill up the exams array
        let exams = [];
        if(filterType === 'all') {
            exams = this.examManager.exams;
        }
        else {
            exams = this.examManager.getByYear(filterType);
        }

        // generate a new (custom) event to warn App.js of the change
        document.dispatchEvent(new CustomEvent('filter-selected', {detail: exams}));
    }
}

export default Filters;