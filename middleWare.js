const Listing = require("./model/listing");
const { listingJoiSchema,reviewJoiSchema } = require('./schema.js');
const ExpressError = require('./utils/expressError.js');

module.exports.isLoggedIn = (msg = "You must be logged in!") => {
    return (req, res, next) => {
    console.log('isloggedin MW')
        if (!req.isAuthenticated()) {
            req.session.url = req.originalUrl
            req.flash('error', msg);
            return res.redirect("/login");
        }
        next();
    };
};
module.exports.saveUrl = (req, res, next) => {
    if (req.session.url) {
        res.locals.url = req.session.url;
    }
    next();
};

module.exports.isOwner =async (req, res, next) => {
    let { id } = req.params;
    console.log("isOwner MW")
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!!!");
        return res.redirect(`/listings/${id}`); // Redirect to the edit page to fetch updated data
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    let { error } = listingJoiSchema.validate(req.body);
    console.log("ValodatingListing MW")
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}