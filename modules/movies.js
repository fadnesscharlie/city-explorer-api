'use strict';

const axios = require('axios');

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
    console.log('searchQuery', searchQuery);

    let movies = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`)
   
    // console.log('MOVIES1!!', movies.data.results);
   
    response.send(movies.data.results.map(movie => new Movies(movie)));
  } catch (error) {
    console.log(`Error: ${error}`)
  }
};

module.exports = getMovies;
