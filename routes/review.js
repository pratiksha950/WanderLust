const express = require("express");
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const {validateReview ,isLoggedIn,isReviewAuthor} =require("../views/middleware/middleware.js")


const reviewController=require("../controllers/reviews.js")

//review
//  Post review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview)
)

//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview))

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