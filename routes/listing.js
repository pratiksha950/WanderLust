const express = require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js")//joi
const ExpressError=require("../utils/ExpressError.js")
const Listing =require("../models/Listing.js");



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


//index routev completed
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index",{allListings});
    }));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new")
})

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing})
}))

//create Route
// router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings")
// }))

router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);

    if (!newListing.image || !newListing.image.url) {
        newListing.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        };
    }

    await newListing.save();
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing})
}))

//update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))

//DELETE Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})
)

module.exports=router;
