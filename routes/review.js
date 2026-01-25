const express = require("express");
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const Review =require("../models/review.js");
const {reviewSchema}=require("../schema.js")//joi
const Listing =require("../models/Listing.js");

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


//review
//  Post review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)

    listing.reviews.push(newReview._id);
    await newReview.save()
    await listing.save()
    req.flash("success","new review created")
    res.redirect(`/listings/${listing._id}`)
})
)

//delete review Route
router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findById(reviewId)
        req.flash("success","Review Deleted")
        res.redirect(`/listings/${id}`)
    }))

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new vila",
//         description:"By the beach",
//         price:1200,
//         location:"alphanche,Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample was save");
//     res.send("Sucessfull testing")
// })

module.exports=router;