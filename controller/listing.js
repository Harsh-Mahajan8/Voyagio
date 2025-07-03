const Listing = require('../model/listing');
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
//opencage Geocoding
async function getCoordinates(location, country) {
    try {
        const opencage = require('opencage-api-client');
        const data = await opencage.geocode({
            q: `${location}, ${country}`,
            key: process.env.GEO_API_KEY // Replace with your actual OpenCage API key
        });

        if (data.results.length > 0) {
            const place = data.results[0];
            return place.geometry;
        } else {
            console.log('No results found');
            return null;
        }
    } catch (error) {
        console.log('Error fetching coordinates:', error.message);
        return null;
    }
};


module.exports.index = async (req, res) => {
    console.log('/listing route');
    const listings = await Listing.find({});
    res.render('./listing/home', { listings });
};

module.exports.createNewListing = (req, res) => {
    console.log('/listing/new route');
    res.render('listing/new.ejs');
};

module.exports.saveNewListing = async (req, res, next) => {
    console.log('/listing route');
    console.log(req.body);
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;

    res.locals.location = newListing.location;
    console.log(res.locals.location);

    let { lat, lng } = await getCoordinates(newListing.location, newListing.country);
    newListing.coordinates = [lat, lng];

    console.log(newListing);
    await newListing.save();
    req.flash("save", "New Listing Created!!")
    res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
    console.log('/listing/:id route');
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('reviews').populate('owner');
    if (!listing) {
        req.flash("error", "Listing does not exist!!");
        return res.redirect('/listings');
    }
    let {lat, lng} = await getCoordinates(listing.location, listing.country);
    listing.coordinates = [lat, lng];
    console.log(listing);
    res.render('listing/show.ejs', { listing });
};

module.exports.showEditPage = async (req, res) => {
    console.log('/listing/:id/edit route');
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace('/upload', "/upload/w_250")
    res.render("listing/edit.ejs", { listing, originalUrl });
};

module.exports.saveEditedListing = async (req, res) => {
    console.log('/listing/:id route ');
    const { id } = req.params;
    console.log(req.body);
    let editedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        editedListing.image = { url, filename };
        await editedListing.save();
    }
    req.flash('save', "Listing Edited!!");
    res.redirect(`/listings/${id}`); // Redirect to the edit page to fetch updated data
};

module.exports.deleteListing = async (req, res) => {
    console.log('/listing/:id delete route')
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('error', "Listing Deleted!!")
    res.redirect('/listings');
};

module.exports.searchPage = async(req, res) => {
    console.log(req.path);
    let query = req.query.search;
    let listings = await Listing.find({
      $or: [
        { feature: query },
        { location: query },
        { country: query }
      ]
    });
    res.render('listing/filter',{listings, query});
}

