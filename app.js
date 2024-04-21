if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require("./models/user.js");
const passport = require('passport');
const LocalStrategy = require('passport-local');


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user.js");
const { log } = require('console');

// const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const dbUrl = process.env.ATLAS_URL;
main()
  .then(() => {
    console.log("Connnected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//Mongo store session info on mogoatlus
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
      secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // See below for details
});

store.on("error", () => {
  console.log("Error in MongoSession store");
})


//for cookie sessions
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false, // Set it to false to remove the deprecation warning
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



// app.get("/", (req, res) => {
//   res.send("Hii,I am Groot");
// });




app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get("/demousers", async (req, res) => {
  
    // If the user doesn't exist, register them
    let fakeUser = new User({
      email: "student@gmail.com",
      username: "delta-student",
    });
    let registeredUser = await User.register(fakeUser, "helloji");

    // Log the registered user and send their information
    console.log(registeredUser);
    res.send(registeredUser);
})




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(
    new ExpressError(
      404,
      "Page Not Found. Please send valid data for all listings."
    )
  );
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

app.listen(4000, () => {
  console.log("server is listening to port 4000");
});


