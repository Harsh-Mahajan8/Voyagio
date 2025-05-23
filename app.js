const express = require('express');
const mongoose = require("mongoose");
const app = express();
const Listing = require('./model/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.set('view engine', "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('method'));
app.listen(8080, () => {
    console.log('Server Connected')
});

app.use((req, res, next) => {
    console.log(req.method, req.path, req.hostname);
    next();
})
app.get('/', (req, res) => {
    console.log('/ route');
});
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Voyagio'
).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.get('/', (req, res) => {
    console.log('/ route');
});

app.get('/listings', async (req, res) => {
    const listings = await Listing.find({});
    res.render('listing/home', { listings });
});

app.get('/listing/new', (req, res) => {
    console.log('/listing/new route');
    res.render('listing/new.ejs');
});

app.get('/listing/:id', async (req, res) => {
    console.log('/listing/:id route');
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listing/show.ejs', { listing });
});

app.post('/listings', async (req, res) => {
    console.log('/listing route');
    let data = req.body;
    let newListing = new Listing(data);
    await newListing.save();
    res.redirect('/listings');
});

app.get('/listing/:id/edit', async (req, res) => {
    console.log('/listing/:id/edit route');
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("listing/edit.ejs", { listing });
});

app.put('/listing/:id', async (req, res) => {
    console.log('/listing/:id route ');
    let { id } = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id, { ...data }); // Ensure the updated data is saved
    res.redirect(`/listing/${id}`); // Redirect to the edit page to fetch updated data
});


app.delete('/listing/:id', async (req, res) => {
    console.log('/listing/:id delete route')
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})