const express = require('express');
morgan = require('morgan');
fs = require('fs'), //import built in node modules fs and path
path = require('path');

//LIST OF TOP 10 SUPER-HERO MOVIES
let topMovies = [
    {
        title: 'Spider-man: Into The Spider-Verse',
        year: 2018,
        directors: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    },
    {
        title: 'The Incredibles',
        year: 2004,
        directors: 'Brad Bird',
    },
    {
        title: 'Black Panther',
        year: 2018,
        directors: 'Ryan Coogler',
    },
    {
        title: 'Advengers: Endgame',
        year: 2019,
        directors: 'Anthony Russo, Joe Russo',
    },
    {
        title: 'Logan',
        year: 2017,
        directors: 'James Mangold',
    },
    {
        title: 'The Dark Knight',
        year: 2008,
        directors: 'Christopher Nolan',
    },
    {
        title: 'Iron Man',
        year: 2008,
        directors: 'Jon Favreau',
    },
    {
        title: 'Superman: The Movie',
        year: 1978,
        directors: 'Richard Donner',
    },
    {
        title: 'Wonder Woman',
        year: 2017,
        directors: 'Patty Jenkins',
    },
    {
        title: 'Thor: Ragnarok',
        year: 2017,
        directors: 'Taika Waititi',
    },
];

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags : 'a'})

// set up the logger
app.use (morgan ('combined', {stream: accessLogStream}));

/* const http = require ('http');
url = require('url');

    http.createServer((request, response) => {
    let requestURL = url.parse(request.url, true);
    if ( requestURL.pathname == '/documentation.html') {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Documentation on the bookclub API.\n'); 
} else {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Welcome to my book club!\n');
}
}).listen(8080); */

// STATIC FILES 
app.use('/staticFiles', express.static('public'));


//GET REQUEST
app.get('/', (req, res) => {
    res.send('Thank you for visiting myFlix!');
    console.log('Thank you for visiting myFlix!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
});
app.get('/movies', (req, res) => {
    res.json(topMovies);
    console.log('Top 10 Superhero Movies');
});


// LISTEN FOR REQUESTS

app.listen(8080, () => { 
    console.log('My first Node test server is running on Port 8080.');
}); 