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

const PORT = process.env.PORT;
// ------------------------------------------
// everything above this line is what we need for an express server (or close it)

class Forecast {
  constructor(date, des) {
    this.date = date;
    this.des = des;
  }
}

let weatherData = require('./data/weather.json');

console.log('Port is: ', PORT)

try {
  app.get('/weather', (request, response) => {
    let searchQuery = request.query.city_name;
    let weatherArray = [];

    // If we get the request from the front end
    if (searchQuery) {
      let cityWeather = weatherData.find(town => town.city_name === searchQuery);

      // If the request matches a city in our data
      if (cityWeather) {
        cityWeather.data.map(info => {
          weatherArray.push(
            // Push in Object array of each day
            new Forecast(
              `${searchQuery} has ${info.weather.description} on ${info.valid_date}. The Longitude is ${cityWeather.lon}, the Latitude is ${cityWeather.lat}.`
            )
          )
        })
      }
    };
    // Send back the object array to the front end when they ask for it
    response.send(weatherArray);
  })
  } catch (error) {
    console.log(`Error occcured: ${error.response.data.error}, Status: ${error.response.status}`)
}

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

// tell our server to start listening for requests
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

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
