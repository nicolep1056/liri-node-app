require("dotenv").config();


var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var action = process.argv[2];
var parameter = process.argv[3];




function switchCase() {

  switch (action) {

    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          

    case 'spotify-this-song':
      spotifyThis(parameter);
      break;

    case 'movie-this':
      movieInfo(parameter);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

      default:                            
      logData("Invalid Entry");
      break;

  }
};

function bandsInTown(parameter){

if (action === 'concert-this')
{
	var artist="";
	for (var i = 3; i < process.argv.length; i++)
	{
		artist+=process.argv[i];
	}
	console.log(artist);
}
else
{
	artist = parameter;
}



var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var dTime = JS[i].datetime;
        var month = dTime.substring(5,7);
        var year = dTime.substring(0,4);
        var day = dTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
  
      logData("\n--------------------------------\n");

        
      logData("Date: " + dateForm);
      logData("Name: " + JS[i].venue.name);
      logData("City: " + JS[i].venue.city);
      if (JS[i].venue.region !== "")
      {
        logData("Country: " + JS[i].venue.region);
      }
      logData("Country: " + JS[i].venue.country);
      logData("\n--------------------------------\n");
    }
  }
});
}




function spotifyThis(parameter) {

  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "The Sign Ace of Base";
  } else {
    searchTrack = parameter;
  }

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    if (error) {
      logData('Error occurred: ' + error);
      return;
    } else {
      logData("\n-----------------------------------\n");
      logData("Artist: " + data.tracks.items[0].artists[0].name);
      logData("Song: " + data.tracks.items[0].name);
      logData("Preview: " + data.tracks.items[3].preview_url);
      logData("Album: " + data.tracks.items[0].album.name);
      logData("\n-----------------------------------\n");
      
    }
  });
};


function movieInfo(parameter) {

  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(err, res, body) {
  	var movie = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      logData("\n-------------------------------\n");
      logData("Title: " + movie.Title);
      logData("Release Year: " + movie.Year);
      logData("IMDB Rating: " + movie.imdbRating);
      logData("Rotten Tomatoes Rating: " + movie.Ratings[1].Value); 
      logData("Country: " + movie.Country);
      logData("Language: " + movie.Language);
      logData("Plot: " + movie.Plot);
      logData("Actors: " + movie.Actors);
      logData("\n--------------------------------\n");
    }
  });
};

function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return logData(error);
      }

  var randomReq = data.split(",");
    
    if (randomReq[0] === "spotify-this-song") 
    {
      var songcheck = randomReq[1].trim().slice(1, -1);
      spotifyThis(songcheck);
    } 
    else if (randomReq[0] === "concert-this") 
    { 
      if (randomReq[1].charAt(1) === "'")
      {
      	var dLength = randomReq[1].length - 1;
      	var data = randomReq[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else
      {
	      var bandName = randomReq[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
  	  
    } 
    else if(randomReq[0] === "movie-this") 
    {
      var movie_name = randomReq[1].trim().slice(1, -1);
      movieInfo(movie_name);
    } 
    
    });

};

function logData(dataToLog) {

	console.log(dataToLog);

}


switchCase();
