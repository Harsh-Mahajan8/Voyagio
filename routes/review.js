const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../model/review');
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview }= require('../middleWare.js');
const { saveReview, deleteReview } = require('../controller/review.js');

//post route
router.post("/", validateReview,
    isLoggedIn('You must be Logged in to create a new Review!!!')
    , wrapAsync(saveReview))

//delete route
router.delete('/:reviewId',
    isLoggedIn('You must be Logged in to delete a review!!!'),
    wrapAsync(deleteReview))

module.exports = router;