const Review = require('../model/review');
const Listing = require('../model/listing');
module.exports.saveReview = async (req, res) => {
        console.log(req.route.path)
        let listing = await Listing.findById(req.params.id);
        const review1 = new Review(req.body.review);
        const user = req.user.username;
        review1.name = user;
        console.log(review1);
        console.log(user);
        listing.reviews.push(review1);
        await review1.save();
        await listing.save();
        console.log('new review saved');
        req.flash("save", "New Review Saved!!");
        res.redirect(`/listings/${req.params.id}`)
    };

module.exports.deleteReview = async (req, res) => {
        console.log(req.route.path, req.user);
        let { id, reviewId } = req.params;
        let { name } = await Review.findById(reviewId)
        if (name == req.user.username) {
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});        
            await Review.findByIdAndDelete(reviewId);
            req.flash("error", "Review Deleted!!");
            res.redirect(`/listings/${id}`);
        }else{
            req.flash('error',"You are not this review owner!!");
            res.redirect(`/listings/${id}`);
        }
    }