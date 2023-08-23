const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const fs = require('fs'); //import built in node modules fs and path
const path = require('path');
    
const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

const cors = require ('cors');
app.use(cors());

    let auth = require ('./auth')(app);
    const passport = require('passport');
    require('./passport');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const User = Models.User;
// mongoose.connect('mongodb+srv://myflixadmin:fj4YZhabwlipiIOX@cluster0.ltpi7kt.mongodb.net/sample_mflix', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect( 'mongodb+srv://adminmyflix:password12345@myflixdb.jjcd40j.mongodb.net/myFlixDB?retryWrites=true&w=majority ', { useNewUrlParser: true, useUnifiedTopology: true });

//local host 
//mongoose.connect('mongodb://localhost:27017/mvapi', { useNewUrlParser: true, useUnifiedTopology: true});


let movies = [
    {
        "Title": "A Knights Tale",
        "Description": "After his master dies, a peasant squire, fueled by his desire for food and glory, creates a new identity for himself as a knight.",
        "Genre": {
            "Name": "Romantic Comedy",
            "Description": "A light, comic movie or other work whose plot focuses on the development of a romantic relationship."
        },
        "Director": {
            "Name": "Brian Helgeland",
            "Bio": "Brian Thomas Helgeland is an American screenwriter, film producer and director. He is most known for writing the screenplays for the films L.A. Confidential and Mystic River.",
            "Birth": 1961.0
    },
    "ImageURL": "https://www.imdb.com/name/nm0001338/mediaviewer/rm458430976/?ref_=nm_ov_ph",
    "Featured":false
},
{
    "Title": "Life is Beautiful",
    "Description": "A gentle Jewish-Italian waiter, Guido Orefice (Roberto Benigni), meets Dora (Nicoletta Braschi), a pretty schoolteacher, and wins her over with his charm and humor. Eventually they marry and have a son, Giosue (Giorgio Cantarini). Their happiness is abruptly halted, however, when Guido and Giosue are separated from Dora and taken to a concentration camp. Determined to shelter his son from the horrors of his surroundings, Guido convinces Giosue that their time in the camp is merely a game.",
    "Genre": {
        "Name": "Drama",
        "Description": "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    "Director": {
        "Name": "Roberto Benigni",
        "Bio": "Roberto Remigio Benigni Cavaliere di Gran Croce is an Italian actor, comedian, screenwriter and director. He gained international recognition for writing, directing and starring in the Holocaust comedy-drama film Life Is Beautiful (1997), for which he received the Academy Awards for Best Actor and Best International Feature Film. Benigni remains the only actor to win the Best Actor Academy Award for a non-English language performance.",
        "Birth":1952.0
},
"ImageURL": "https://en.wikipedia.org/wiki/Roberto_Benigni#/media/File:Roberto_Benigni-5274.jpg",
"Featured":false
},
{
    "Title": "The Pale Blue Eye",
    "Description": "A world-weary detective is hired to investigate the murder of a West Point cadet. Stymied by the cadets' code of silence, he enlists one of their own to help unravel the case - a young man the world would come to know as Edgar Allan Poe.",
    "Genre": {
        "Name": "Horror",
        "Description": "The Dictionary of Film Studies defines the horror film as representing: disturbing and dark subject matter, seeking to elicit responses of fear, terror, disgust, shock, suspense, and, of course, horror from their viewers."
    },
    "Director": {
        "Name": "Scott Cooper",
        "Bio": "Scott Cooper is an American director, screenwriter, producer and actor. He is known for writing and directing Crazy Heart (2009), Out of the Furnace (2013), Black Mass (2015), and Hostiles (2017). Abingdon, Virginia, U.S.",
        "Birth":1970.0
},
"ImageURL": "https://en.wikipedia.org/wiki/Scott_Cooper_(director)#/media/File:Scott_Cooper_at_the_2010_Independent_Spirit_Awards.jpg",
"Featured":false
},
{
    "Title": "Flight",
    "Description": "An airline pilot saves almost all his passengers on his malfunctioning airliner which eventually crashed, but an investigation into the accident reveals something troubling.",
    "Genre": {
        "Name": "Action",
        "Description": "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats."
    },
    "Director": {
        "Name": "Robert Zemeckis",
        "Bio": "Robert Lee Zemeckis is an American filmmaker. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone, the science-fiction comedy Back to the Future film trilogy, and the live-action/animated comedy Who Framed Roger Rabbit.",
        "Birth": 1952.0
},
"ImageURL": "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcQshGN7-dPYmd6C2ah3-Or1p-tju4u03SNDak4tCve2QLwacczJ-iv8th2yzgliS0pKGz1fdk6Db7RWZCQ",
"Featured":false
},
];

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

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
    flags : 'a'
});
// set up the logger
app.use (morgan ('combined', {stream: accessLogStream}));

// STATIC FILES - automatically sends all files that are requested from within the public folder.
app.use('/staticFiles', express.static('public'));

//C R U D operations
//CREATE
//Create new user
app.post('/users', 
[check('UserName', 'UserName is required').isLength({ min: 4, max: 9 }),
check (
    'UserName',
    'UserName contains non alphanumeric characters - not allowed.'
).isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail(),
], async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array() });
    }
    let hashedPassword = User.hashPassword(req.body.Password);
    await User.findOne({ UserName: req.body.UserName }) // Search to see if a user with the requested username already exists
    .then ((user) => {
        if (user) {  //If the user is found, send a response that it already exists
            return res.status(400).send(req.body.UserName + 'already exists');
        } else { 
            User
            .create({
                UserName: req.body.UserName,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }        
})
.catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
});
});

// Add a movie to a user's list of favorites

app.post("/users/:Username/movies/:MovieID", (req, res) => {
    User.findOneAndUpdate(
        { UserName: req.params.Username },
        {
          $push: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
      )
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
);

/*app.post('/users/:UserName/movies/:MovieID', (req, res) => {
    User.findOne({ UserName: req.params.UserName }, {
    $push: { FavoriteMovies: req.params.MovieID }
    },
     { new: true }).then( // This line makes sure that the updated document is returned
    (err, updatedUser) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
       // res.json(updatedUser).send(); 
        console.log('successfully updated');
        res.status(200).send(updatedUser)
    }
    });
});*/


//READ 
//GET REQUEST
app.get('/', (req, res) => {
    res.send('Thank you for visiting myFlix!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //res.status(200).json(movies)
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err)
    });
});

app.get('/movies/:title', (req, res) => {
    Movies.findOne({ title: req.params.title})
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
    });
});

app.get('/movies/genre/:genreName', (req, res) => {
    Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        res.status(500).send("Error:" + err);
    });
});

app.get('/movies/directors/:directorName', (req, res) => {
    Movies.find({ 'Director.Name': req.params.directorName })
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        res.status(500).send("Error:" + err);
    });
});

// Get all users
app.get('/users', (_req, res) => {
    User.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get a user by username 
app.get('/users/:UserName', (req, res) => {
    User.findOne({ UserName: req.params.UserName })
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//UPDATE
/* app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user){
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }

})*/

//Updates user info
app.put('/users/:UserName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //CONDITION TO CHECK ADDED HERE
    if (req.user.UserName !== req.params.UserName){
        return res.status(400).send('Permission Denied');
    }
    //CONDITION ENDS
    await User.findOneAndUpdate({UserName: req.params.UserName}, { 
        $set: {
            Username: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new: true}) // This line makes sure that the updated document is returned

    /*(err, updateUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updateUser);
        }*/
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        })
});


//DELETE
app.delete(
    "/users/:Username/movies/:MovieID",
    (req, res) => {
        User.findOneAndUpdate(
            { UserName: req.params.Username },
            {
                $pull: { FavoriteMovies: req.params.MovieID },
            },
            { new: true }
            )
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
        }
        );

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = User.find( user => user.id == id);

    if (user){
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})

app.delete('/users/:UserName', (req, res) => {
    User.findOneAndDelete({ UserName: req.params.UserName })
    .then((users) => {
        if (!users) {
            res.status(400).send(req.params.UserName + ' was not found');
        } else {
            res.status(200).send(req.params.UserName + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/documentation', (req, res) => {
    res.sendFile('myflix/public/documentation.html', {root: __dirname });
});

//MIDDLEWARE ERROR
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oh no! What did you do?');
});

// LISTEN FOR REQUESTS
/* app.listen(8080, () => { 
    console.log('My first Node test server is running on Port 8080.');
}); */

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});