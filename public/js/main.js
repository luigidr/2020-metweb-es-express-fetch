"use strict";

import App from './app.js';

// getting the two containers
const examContainer = document.querySelector('#my-exams');
const sidebarContainer = document.querySelector('#sidebar');

// creating our app
const app = new App(examContainer, sidebarContainer);
