if(process.env.NODE_ENV !== 'production')
{
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ErrorExpress = require("./utils/ErrorExpress.js");
const { listingschema, reviewschema } = require("./schema.js");
const { constants } = require("http2");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const listing = require('./models/listing');
dbUrl = process.env.ATLAS_DB;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret : process.env.SECRET_KEY,
    touchAfter : 24 * 3600
  }
})

store.on("error", (err) => {
  console.log("ERROR ON MONGODB SESSION", err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    Maxage : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
}

app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(cookieparser("ram"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req, res,next)=>
{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curr_user = req.user;
  next();
})

//route files path
const lisitings = require('./routes/listings.js');
const reviews = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const { rmSync } = require('fs');



//database connection
main()
  .then(() => {
    console.log("connection of DB successfully established");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

//routes
app.use('/listings',lisitings);
app.use('/listings/:id/reviews',reviews);
app.use('/', userRouter);


app.get("/demouser", async(req, res) => 
{
  let fackuser = new user(
    {
      email : "admin234@gmail.com",
      username : "superadmin123",
    })
  let fackregister = await user.register(fackuser,'super@123');
  res.send(fackregister);
});

app.get("/setcookies", (req, res) => 
{
  res.cookie('name', 'shyam', {signed: true});
  res.cookie('surname', 'singh');
  res.send("what is your name? ");
});

app.get("/getcookies", (req, res) =>
{
  let {name = "admin"} = req.cookies;
  console.dir(req.cookies);
  res.send(`My name is ${name}`);
});

app.post("/listings/navsearchbar", async(req, res) =>
{
  let {search} = req.body;
  let alllistings = await listing.find({
    $or: [
      { country: search },
      { category: search },
      { title : search},
      {location: search}
    ]
  });
  if(alllistings.length === 0)
  {
    req.flash("error", "Please enter valid location");
    return res.redirect("/listings");
  }
  res.render("./listings/index.ejs", { alllistings });
})

app.get("/register", (req, res) =>
{
  let {name = "admin"} = req.query;
  req.session.name = name;
  res.send(`session registered successfully`);
});

app.get("/login", (req, res) =>
{
  res.send(`Hello ${req.session.name}`);
});

//error handlers
app.all("*", (req, res, next) => 
{
  next(new ErrorExpress(404, "Page not found :("));
});

app.use((err,req, res,next) => {
  let {status = 500, message = "internal server error"} = err;
  res.render("./listings/error.ejs",{message});
  // res.status(500).send(message);
});


app.listen(8080, () => {
  console.log("listening on port 8080");
});
