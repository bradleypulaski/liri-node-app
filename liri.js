var keys = require("./keys.js");
var inquirer = require("inquirer");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

function lrng() {
    return Math.floor(Math.random() * 3) + 1; 
}

function logm(message) {
    var dt = new Date();
    var timestamp = dt.toUTCString();


          fs.appendFile("log.txt",'\n\r' + message + " - "  + timestamp, function(err) {

                   if (err) {
                    return console.log(err);
                  }

                  

                });
}

function spotify(song) {
    var spotify = new Spotify({
        id: "8bc7a2373b3f43da82f9ae269f557e15",
        secret: "4b281484f2574d56acca6e18bd3315ad"
    });

    spotify.search({
        type: 'track',
        query: song
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var track = data.tracks.items[0];
        var artists = "";
        for (var key in track.artists) {
            artists += track.artists[key].name + " ";
        }
        var songname = track.name;
        var link = track.external_urls.spotify;
        var album = track.album.name;
        console.log(artists);
        console.log(album);
        console.log(songname);
        console.log(link);
         
    });
}

function movie_this(movie) {
    if (movie == "") {
        movie = "Mr. Nobody"
    }
    var movie = movie.replace(" ", "+");
    request("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy", function(error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            var title = body.Title;
            var year = body.Year;
            var rating = body.Ratings[0].Value;
            var tomatorating = body.Ratings[1].Value;
            var country = body.Country;
            var language = body.Language;
            var plot = body.Plot;
            var actors = body.Actors;
            console.log(title);
            console.log(year);
            console.log("IMDB: " + rating);
            console.log("Rotten Tomatoes: " + tomatorating);
            console.log(country);
            console.log(language);
            console.log(plot);
            console.log(actors);

        }
    });
}

function tweets() {

    var client = new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret
    });
    var params = {
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var key in tweets) {
                var tweet = tweets[key];
                console.log(tweet.text + " - " + tweet.created_at);

            }
        }
    });
}

inquirer
    .prompt([{
        type: "list",
        message: "Commands",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command"
    }]).then(function(result) {

        if (result.command == "my-tweets") {
            tweets();
            logm("my-tweets");
        }

        if (result.command == "spotify-this-song") {
            inquirer
                .prompt([{
                    type: "input",
                    message: "Song Name?",
                    name: "song"
                }]).then(function(result) {

                    spotify(result.song);
                    logm("spotify-this-song,'" +  result.song + "'");

                });
        }


        if (result.command == "movie-this") {
            inquirer
                .prompt([{
                    type: "input",
                    message: "Movie Name?",
                    name: "movie"
                }]).then(function(result) {
                    var movie = result.movie;
                    movie_this(movie);
                    logm("movie-this,'" +  movie + "'");

                });
        }
         if (result.command == "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function(error, data) {

              // If the code experiences any errors it will log the error to the console.
              if (error) {
                return console.log(error);
              }
              logm("do-what-it-says");


              // We will then print the contents of data
              console.log(data);

              // Then split it by commas (to make it more readable)
              var dataArr = data.split(",");

              var command = dataArr[0];
              if (command == "my-tweets") {
                tweets();
              }
              if (command == "spotify-this-song") {
                var arg = dataArr[1];
                spotify(arg);
              }
              if (command == "movie-this") {
                var arg = dataArr[1];
                movie_this(arg);
              }

              var random = ['spotify-this-song,"I Want it That Way"', 'movie-this,"Space Jam"', "my-tweets"];
              var rng = lrng();
              rng--;
              var pick = random[rng];
              fs.writeFile("random.txt", pick, function(err) {

                   if (err) {
                    return console.log(err);
                  }

                  

                });
            });

        }
    });