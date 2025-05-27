const express = require('express');
const mongoose = require("mongoose");
const app = express();
const Listing = require('./model/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require('./utils/expressError.js');

app.set('view engine', "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.listen(8080, () => {
    console.log('Server Connected')
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Voyagio'
).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

//home route
app.get('/listings', wrapAsync(async (req, res) => {
    console.log('/listing route');
    const listings = await Listing.find({});
    res.render('listing/home', { listings });
}));

//create new listing page 
app.get('/listings/new', (req, res) => {
    console.log('/listing/new route');
    res.render('listing/new.ejs');
});

//save new listing
app.post("/listings", wrapAsync(async (req, res, next) => {
     console.log('/listing route');
     try{
       
        let newListing = new Listing(req.body);
        await newListing.save();
    }catch{
        next(err);
    }
        res.redirect('/listings');
    }));

//show route
app.get('/listings/:id',wrapAsync( async (req, res) => {
    console.log('/listing/:id route');
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listing/show.ejs', { listing });
}));

//show edit page
app.get('/listings/:id/edit',wrapAsync( async (req, res) => {
    console.log('/listing/:id/edit route');
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

//save editted listing
app.put('/listings/:id',wrapAsync( async (req, res) => {
    console.log('/listing/:id route ');
    let { id } = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id, { ...data }); // Ensure the updated data is saved
    res.redirect(`/listings/${id}`); // Redirect to the edit page to fetch updated data
}));

//delete listing
app.delete('/listings/:id',wrapAsync( async (req, res) => {
    console.log('/listing/:id delete route')
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
});

app.use((err, req, res, next) => {
    let { status = 404, message = "Somethong went wrong!!" } = err;
    res.status(status).send(message);
});