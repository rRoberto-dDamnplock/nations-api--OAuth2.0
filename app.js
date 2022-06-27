require('dotenv').config()
const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const localStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var findOrCreate = require('mongoose-findorcreate')
const app = express()
const port = 3000

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false

}));

app.use(passport.initialize())
app.use(passport.session())


mongoose.connect('mongodb://0.0.0.0:27017/nationsDB', {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleID: String,
  secret: Array
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());


passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
//google auth strategy 



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/nations",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
    User.findOrCreate({
      googleID: profile.id
    }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get('/', (req, res) => {
  res.render("signup")
})

app.get("/auth/google",
  passport.authenticate('google', {
    scope: ["profile"]
  })
);

app.get("/auth/google/nations",
  passport.authenticate('google', {
    failureRedirect: "/login"
  }),
  function (req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/nations");
  });


app.get('/login', (req, res) => {
  res.render("login")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})
app.get("/nations", (req, res) => {
  User.find({"username": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("nations");
      }
    }
  });
})


app.post("/signup", (req, res) => {

  User.register({
    username: req.body.username
  }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res,  () => {
        res.redirect("/nations");
      });
    }
  });

});


app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/nations");
      });
    }
  });

});





// app.post("/signup", (req, res) => {
//   console.log(req.body.mail)
//   console.log(req.body.password)
//   res.redirect("/nations")
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})