const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
}, {collection: 'movies'});

const userSchema = mongoose.Schema({
    UserName: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MovieID' }]
})

const Movie = mongoose.model('movies', movieSchema);
const User = mongoose.model('users', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
