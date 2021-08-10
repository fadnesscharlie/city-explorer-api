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
  try {
    let getLat = request.query.lat;
    let getLon = request.query.lon;
    console.log('inside weather backend');
    // let getLat = 47
    // let getLon = -122
    console.log('lon', getlon, 'lat', getLat);
    multiDayWeather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${getLat}&lon=${getLon}&key=${process.env.WEATHER_API_KEY}`);

    console.log(multiDayWeather.data.data);

    response.send(multiDayWeather.data.data.map(day => new Forecast(day)));
  } catch (error) {
    console.log(`Error Function/response: ${error}`)
  }

};

module.exports = getWeather;
