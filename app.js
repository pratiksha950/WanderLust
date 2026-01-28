if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dbUrl=process.env.ATLASDB_URL
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");   

// routes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//DATABASE

main()
    .then(() => console.log("connected to mongoDB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}
//VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// method override
app.use(methodOverride("_method"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// SESSION
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("error in mongo session store",err);
})

const sessionoptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionoptions));
app.use(flash());

//PASSPORT 

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// LOCALS 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  
       next();   
});

//ROUTES 
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//ERROR HANDLING
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// SERVER 
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
