/*
Entry point into the express app. Run using either
node app.js or nodemon app.js
*/

//Import the necessary libraries for the app
var express = require('express'), //Makes the magic happen
    logger = require('morgan'), //So we can actually see whats happening on the command line
    path = require('path'), //makes it easier to write the path to things
    config = require("config"),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'), //Sessions for user login
    passport = require('passport'),
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy; //passport to handle actual login

var CLIENTID = (process.env.CLIENTID) ? process.env.CLIENTID : 'test';
var CLIENTSECRET = (process.env.CLIENTSECRET) ? process.env.CLIENTSECRET : 'this is not a secret ;)';
var CALLBACKURL = (process.env.CALLBACKURL) ? process.env.CALLBACKURL : 'https://localhost:3000/auth/google/callback';
//Schemas will go here

//route files will go here
var dataCollection = require('./routes/data.js');
var auth = require('./routes/auth.js');

//initialize the app and connect DB
var app = express();

var PORT = process.env.PORT || 3000;

//TODO: change passport stuff to google. 
passport.serializeUser(function(user, done) {
  done(null, {id: user.google_id, name: user.username});
});

passport.deserializeUser(function(obj, done) {
  // User.findOne({googleId: obj.id}, function(err, user){
  //   done(null, user);
  // });
  config.db.query('SELECT * FROM `users` WHERE google_id=?', [obj.id], function(err, user){
    if (err) return done(err);
    return done(null, user);
  });
});

passport.use(new GoogleStrategy({
 clientID: CLIENTID,
 clientSecret: CLIENTSECRET,
 callbackURL: CALLBACKURL
 // profileFields: ['id', 'displayName']
}, function(accessToken, refreshToken, profile, done) {
 // User.findOne({googleId: profile.id}, function (err, user) {
 //   if (user){
 //    return done(null, user);
 //   } else{
 //    user = new User({name: profile.displayName, googleId: profile.id});
 //    user.save(function(err, user){
 //      return done(null, user);
 //    });
 //   }
   
 // });

  config.db.query('SELECT * FROM `users` WHERE google_id=?',[profile.id], function(err, user){
    if (err) return done(err);
    if (user) return done(null, user);
    config.db.query('INSERT INTO `users` SET ?', {google_id: profile.id, username: name.givenName}, function(err, user){
      if (err) return done(err);
      if (user) return done(null, user);
    });
  });
}
));

//attach userful middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'This is not a secret ;)',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  var url = path.resolve( __dirname + '/views/index.html');
  res.sendFile(url);
});

//login routes
app.get('/session/user', ensureAuthenticated, auth.getUsername);
app.post('/session/end', ensureAuthenticated, auth.logout);
app.get('/auth/google', passport.authenticate('google'), auth.googAuth);
app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/' }), auth.googAuthCallback);


app.post('/mobiledata', dataCollection.postData);
//start the app
app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}