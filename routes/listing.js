const express = require('express');
const router = express.Router();
const listingController = require("../controller/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require('../middleWare.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

router.route('/')
    //home index route
    .get(wrapAsync(listingController.index))

    //save new listing
    .post(isLoggedIn(),upload.single('listing[image]'), validateListing, wrapAsync(listingController.saveNewListing));

//search
router.get('/search', listingController.searchPage);

//create new listing page 
router.get('/new', isLoggedIn('You must be Logged in to create a new Listing!!!'), listingController.createNewListing);

router.route('/:id')
    //show route
    .get(wrapAsync(listingController.showListing))

    //save editted listing
    .put(isLoggedIn(),
        isOwner,
        upload.single('listing[image]'), 
        validateListing,
        wrapAsync(listingController.saveEditedListing))

    //delete listing
    .delete(isLoggedIn("You must be Logged in to delete a Listing!!!"), isOwner, wrapAsync(listingController.deleteListing));

//show edit page
router.get('/:id/edit', isLoggedIn("You must be Logged in to edit a Listing!!!"), isOwner, wrapAsync(listingController.showEditPage));


module.exports = router