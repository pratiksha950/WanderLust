const express = require("express");
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")

const Review =require("../models/review.js");
const {validateReview ,isLoggedIn,isReviewAuthor} =require("../views/middleware/middleware.js")
const Listing =require("../models/Listing.js");



//review
//  Post review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    listing.reviews.push(newReview._id);
    await newReview.save()
    await listing.save()
    req.flash("success","new review created")
    res.redirect(`/listings/${listing._id}`)
})
)

//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
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