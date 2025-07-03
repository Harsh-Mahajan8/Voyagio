if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require("mongoose");
const app = express();
const session = require('express-session');
//expressSession alternative->mongoSession
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/expressError.js');
const flash = require('connect-flash');

const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');

app.set('view engine', "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// const mongoURL = 'mongodb://localhost:27017/Voyagio';
const dbURL = process.env.ATLAS_URL;

// Connect to MongoDB
mongoose.connect(dbURL).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24* 3600
})

const sessionOpt = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    }
}

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080, () => {
    console.log('Server Connected')
});



app.use((req, res, next) => {
    res.locals.save = req.flash("save");
    res.locals.error = req.flash("error");
    res.locals.username = req.session.username;
    res.locals.currUser = req.user;
    next();
});

// app.get('/demo',async (req, res) => {
//     let fakewUser = new User({
//         email:"staaudent@gmail.com",
//         username:"haarsh"
//     });

//     let regUser = await User.register(fakewUser,'helloWorld');
//     res.send(regUser);
// })
//Review routes
app.use('/listings/:id/review', reviewRoutes);
//listing routes
app.use("/listings", listingRoutes);
//user routes
app.use("/", userRoutes);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!!" } = err;
    res.status(status).render('error.ejs', { message });
});
