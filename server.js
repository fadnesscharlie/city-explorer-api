'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const weatherHandler = require('./modules/weather.js');
app.get('/weather', weatherHandler);

let getMovies = require('./modules/movies.js');
app.get('/movies', getMovies);

app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
