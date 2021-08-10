'use strict';

const axios = require('axios');

class Forecast {
  constructor(day) {
    this.date = `Date: ${day.valid_date}.`;
    this.des = `Has ${day.weather.description}`;
  }
}

async function getWeather(request, response) {
  let multiDayWeather = [];
  let getLat = 0;
  let getLon = 0;
  try {
    try {
      getLat = request.query.lat;
      getLon = request.query.lon;
      console.log('inside weather backend');
    } catch (error) {
      console.log('error with Retriving Lat,Lon', error);
    }
    // let getLat = 47
    // let getLon = -122
    try {
      multiDayWeather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${getLat}&lon=${getLon}&key=${process.env.WEATHER_API_KEY}`);

      console.log(multiDayWeather.data.data);
    } catch (error) {
      console.log('error with getting weather forcast', error);
    }
    response.send(multiDayWeather.data.data.map(day => new Forecast(day)));
  } catch (error) {
    console.log(`Error Function/response: ${error}`)
  }

};

module.exports = getWeather;
