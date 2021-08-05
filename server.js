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

const axios = require('axios');

const PORT = process.env.PORT;
// ------------------------------------------
// everything above this line is what we need for an express server (or close it)
console.log('Port Number is: ', PORT)

class Forecast {
  constructor(day) {
    this.date = `Date: ${day.valid_date}.`;
    this.des = `Has ${day.weather.description}`;
  }
}

class Movies {
  constructor(movie) {
    this.imageUrl = `"Image Url": ${movie.backdrop_path}.`;
    this.overview = `"Overview": ${movie.overview}.`;
    this.popularity = `"Popularity": ${movie.popularity}.`;
    this.released = `"Released On": ${movie.release_date}.`;
    this.title = `"Title": ${movie.title}.`;
    this.totalVotes = `"Total Votes": ${movie.vote_count}.`;
    this.votes = `"Votes": ${movie.vote_average}.`;
  }
}

app.get('/weather', async (request, response) => {
  let multiDayWeather = [];
  try {
    let searchQuery = request.query.city_name;

    let weatherData = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${searchQuery}&key=${process.env.WEATHER_API_KEY}`);

    // Pull out the lon and lat from this api
    let lon = weatherData.data.data[0].lon
    let lat = weatherData.data.data[0].lat

    // Use that lon and lat into the new api
    multiDayWeather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`);

    response.send(multiDayWeather.data.data.map(day => new Forecast(day)));
  } catch (error) {
    console.log(`Error: ${error}`)
  }

});

app.get('/movies', async (request, response) => {
  try {

    let searchQuery = request.query.city_name;

    // let searchQuery = 'Seattle';

    let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)

    console.log(movies.data.results);

    // let movieName =


    response.send(movies.data.results.map(movie => new Movies(movie)));
  } catch (error) {
    console.log(`Error: ${error}`)
  }
})















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
