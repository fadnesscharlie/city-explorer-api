'use strict';

const axios = require('axios');

let cache = require('../cache.js');

module.exports = getMovies;

class Movies {
  constructor(movie) {
    this.imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    
    this.overview = `Overview: ${movie.overview}.`;
    this.popularity = `Popularity: ${movie.popularity}.`;
    this.released = `Released On: ${movie.release_date}.`;
    this.title = `Title: ${movie.title}.`;
    this.totalVotes = `Total Votes: ${movie.vote_count}.`;
    this.votes = `Votes: ${movie.vote_average}.`;
  }
}

async function getMovies (request, response){
  try {
    let searchQuery = request.query.query;

    let movies = 'movies-Location: ' + searchQuery
    if(cache[movies] && 
        // A week in Miliseconds                        milisec * sec * min * hour * day
        // Date.now() - cache[searchQuery].timestamp < (1000    * 60  * 60  * 24   * 7)
        
        // Test 10 seconds                       10 seconds
        Date.now() - cache[movies].timestamp < (1000 * 10)
      ){
      console.log('Cache Movies Hit');

      // if we have data already, just send it back
      response.send(cache[movies].data);

    } else {
      console.log('Cache Movies Miss');

      // Call API to get data
      cache[movies] = {};
      let moviesUrl = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)
      
      // map through the data
      let movieArray = moviesUrl.data.results.map(movie => new Movies(movie))

      // save the data to cache
      cache[movies] = {
        data: movieArray,
        timestamp: Date.now(),
      }
      // send data
      response.send(movieArray);
    }
  } catch (error) {
    console.log(`Error: ${error}`)
  }
};

