const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,

Models = require('./models.js'),
passportJWT = require('passport-jwt');

let Users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
    {
    usernameField: 'UserName',
    passwordField: 'Password'
}, 
async (username, password, callback) => {
    console.log('${username} ${password}');

    await Users.findOne({ UserName: username })
    .then((user) => {
        if (!user) {
            console.log('Incorrect Username');
            return callback(null, false, {
                message: 'Incorrect Username or Password.',
            });
            }
            /*if (!user.validatePassword(password)) {
                console.log('Incorrect Password');
                return callback(null,false, { message: 'Incorrect Password.'});
            }*/
            console.log('finished');
            return callback(null, user);
    })
    .catch((err) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
    })
}
)
);

    /*(error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }
        
        if (!user) {
            console.log(' incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        
        console.log('finished');
        return callback(null, user);
    });
}));*/

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
secretOrKey: 'MyJwtSecret'
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));