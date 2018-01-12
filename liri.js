
var keys = require("./keys.js");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var omdb = require('omdb');

var fs = require('fs');

var commandInput = process.argv[2];
var commandName = process.argv[3];

var defaultSong = "The Sign";
var defaultMovie = "Mr.Nobody";

var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret
});

var spotify = new Spotify({
  	id: "3d5bc7f272674a28a6fc97f2cbf485df",
  	secret: "3814db515d934e80afab3316aebeb266"
});

function processCommand(command, commandName){

	switch (command) {

		case "my-tweets":
			tweets();
			break;

		case "spotify-this-song":
			if (commandName){
				spotifyThis(commandName);
			}
			else{
				spotifyThis(defaultSong);
			}
			break;

		case "movie-this":
			if (commandName){
				movieThis(commandName);
			}
			else{
				movieThis(defaultMovie);
			}
			break;

		case "do-what-it-says":
			doWIS();
			break;

	}

}

function tweets(){

	var params = {screen_name: 'rcs_minpark' , count: 20};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  	
		console.log(error);

	  	if (!error) {
	    	for (var i = 0; i < tweets.length; i++){
	    		console.log("");
	    		console.log("Tweet: " + tweets[i].text);
	    		console.log("");
	    		console.log("Created: " + tweets[i].created_at);
	    		console.log("");
	    	}
	  	}
	  	else{
	  		console.log(error);
	  	}

	});
}

function spotifyThis(song){
	spotify.search({

		type: 'track', 
		query: song

	}, function(err, data) {
	  
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	  else {

	  	console.log("");
	  	console.log("Song Information");
	  	console.log("----------------")
	  	console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
	  	console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("----------------")
        console.log("");
	  }
 
	// console.log(data); 
	});
}

function movieThis(movie){

	var key = "trilogy";
	var query = `http://www.omdbapi.com/?apikey=${key}&t=${commandName || defaultMovie}`;

	request(query, function(error, response, body){

		if (!error && response.statusCode == 200) {

			var body = JSON.parse(body);

			console.log("");
			console.log("Movie Information");
			console.log("-----------------");
			console.log("Title: " + body.Title);
			console.log("Release Year: " + body.Year);
      		console.log("IMDB Rating: " + body.imdbRating);
      		console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      		console.log("Country: " + body.Country);
		    console.log("Language: " + body.Language);
		    console.log("Plot: " + body.Plot);
		    console.log("Actors: " + body.Actors);
		    console.log("-----------------");
		    console.log("");
		}
		else{
			console.log(error);
		}

	});

}

function doWIS(){

	fs.readFile('random.txt', 'utf-8', function (error, data){

		if (error){ 
			return console.log(error);
		}

		var dataArr = data.split(',');

		processCommand(dataArr[0], dataArr[1]);

	});
}

processCommand(commandInput, commandName);