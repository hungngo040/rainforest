/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 3
Author: Group 21
*/

const express = require('express');
const app = express();

const port = 5000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, function () {
  console.log(`Server started on: http://localhost:${port}`);
});