const Listing = require("../../models/Listing.js");
const { listingSchema } = require("../../schema.js");
const ExpressError = require("../../utils/ExpressError.js");
const {reviewSchema}=require("../../schema.js")//joi
const Review = require("../../models/review.js");


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner=async(req,res,next)=>{
        let {id}=req.params;
    let listing=await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not owner of this listing !!!");
    return res.redirect(`/listings/${id}`);
    }
    next()
}

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body, { abortEarly: false });

    if (error && error.details) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg || "Invalid Listing  Data");
    } else if (error) {
        throw new ExpressError(400, "Invalid Listing Data");
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });

    if (error && error.details) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg || "Invalid review Data");
    } else if (error) {
        throw new ExpressError(400, "Invalid review Data");
    } else {
        next();
    }
};

const isReviewAuthor=async(req,res,next)=>{
        let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not author of this review !!!");
    return res.redirect(`/listings/${id}`);
    }
    next()
}


module.exports = { isLoggedIn, saveRedirectUrl,isOwner,validateListing,validateReview,isReviewAuthor};
