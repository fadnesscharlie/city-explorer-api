'use strict';

console.log("hello world, from our server");

// in our server, we muse use require instead of import
const express = require('express');

// How its done as per the docs
const app = express();

// allow frontend to acces data from the backend
const cors = require('cors');
app.use(cors());

// use dotenc to access our .enc file -- must be done BEFORE defining PORT
require('dotenv').config();

// const axios = require('axios');

const PORT = process.env.PORT;

// ------------------------------------------

// everything above this line is what we need for an express server (or close it)
console.log('Port Number is: ', PORT)

let getWeather = require('./modules/weather.js');
let getMovies = require('./modules/movies.js');

app.get('/weather', getWeather);
app.get('/movies', getMovies);

// specify what routes our server should be listening for
app.get('/', (request, response) => {
  // when we get that request, we send back the following results
  response.send('Hello, from the server!')
});

// if I am going to catch all other routes 
// MUST BE THE LAST ROUTE
app.get('/*', (request, response) => {
  response.status(404).send('Something went wrong!!')
});


// ---------------------------------------------------
// Entry Info Below


app.get('/banana', (request, response) => {
  // when we get THAT request, we send the following results
  response.send('mmmm, banana...');
});

// query parameters allow us to send extra nforamtion to the backend
// accessed with: http://localhost:3001/sayHello?name=Charlie
app.get('/sayHello,', (request, response) => {
  // we acceess query parameters using request.query
  let name = request.query.name;
  response.send(`Hello, ${name}`);
});

// tell our server to start listening for requests
// MUST BE LAST
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
