//initialize variables
require("dotenv").config();
const keys = require('./keys');
const request = require('request');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const fs = require("fs");

var spotify = new Spotify(keys.Spotify);

//const spotify = new Spotify(keys.Spotify);

let action = process.argv[2];
let name = process.argv.slice(3).join(' ');

//Switch cases for action
switch (action) {
    case 'concert-this':
        concert();
        break;
    case 'spotify-this-song':
        spotifySong();
        break;
    case 'movie-this':
        movie();
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
}


function concert(){
    request(`https://rest.bandsintown.com/artists/${encodeURI(name)}/events?app_id=codingbootcamp`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log([
                `Venue: ${JSON.parse(body)[0].venue.name}`,
                `Location: ${JSON.parse(body)[0].venue.city}, ${JSON.parse(body)[0].venue.region}`,
                `Date: ${moment(JSON.parse(body)[0].datetime).format('MM/DD/YYYY')}`
            ].join('\n'));
            
        }
        else{
            console.log('No events found for the artist at this time.');
        }
    })
}

function spotifySong(){
    if(name){
        spotify.search({ type: 'track', query: name, limit: 1 })
        .then(function(response){
            console.log([
                `Artist(s): ${response.tracks.items[0].album.artists[0].name}`,
                `Song name: ${response.tracks.items[0].name}`,
                `Listen here: ${response.tracks.items[0].external_urls.spotify}`,
                `Album: ${response.tracks.items[0].album.name}`
        ].join('\n'))
        })
    }else{
        spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 1 })
        .then(function(response){
            console.log([
                `Artist(s): ${response.tracks.items[0].album.artists[0].name}`,
                `Song name: ${response.tracks.items[0].name}`,
                `Listen here: ${response.tracks.items[0].external_urls.spotify}`,
                `Album: ${response.tracks.items[0].album.name}`
        ].join('\n'))
        })
    }
}

function movie() {
    if (name){
        request(`http://www.omdbapi.com/?t=${name}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log([
                    `Title: ${JSON.parse(body).Title}`,
                    `Year of Release: ${JSON.parse(body).Released}`,
                    `IMDB Rating: ${JSON.parse(body).imdbRating}`,
                    `Country: ${JSON.parse(body).Country}`,
                    `Language: ${JSON.parse(body).Language}`,
                    `Plot: ${JSON.parse(body).Plot}`,
                    `Actors: ${JSON.parse(body).Actors}`
                ].join('\n'))
            }
        });

    }else {
        request(`http://www.omdbapi.com/?t=${encodeURI('Mr. Nobody')}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log([
                    `Title: ${JSON.parse(body).Title}`,
                    `Year of Release: ${JSON.parse(body).Released}`,
                    `IMDB Rating: ${JSON.parse(body).imdbRating}`,
                    `Country: ${JSON.parse(body).Country}`,
                    `Language: ${JSON.parse(body).Language}`,
                    `Plot: ${JSON.parse(body).Plot}`,
                    `Actors: ${JSON.parse(body).Actors}`
                ].join('\n'))
            }
        });
    }
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data){
        if (error) throw error;

        
        const dataArr = data.split(',');
        action = dataArr[0];
        name = dataArr[1];
        
        switch (action) {
            case 'concert-this':
                concert();
                break;
            case 'spotify-this-song':
                spotifySong();
                break;
            case 'movie-this':
                movie();
                break;
            case 'do-what-it-says':
                doWhatItSays();
                break;
        }
    })
}

