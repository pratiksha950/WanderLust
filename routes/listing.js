const express = require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema}=require("../schema.js")//joi
const ExpressError=require("../utils/ExpressError.js")
const Listing =require("../models/Listing.js");
const {isLoggedIn} =require("../views/middleware/middleware.js")



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
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new")
})

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","listing you requested does not exists")
       return res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show",{listing})
}))

//create Route
router.post("/", validateListing,isLoggedIn, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;

    if (!newListing.image || !newListing.image.url) {
        newListing.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
            filename: "listingimage"
        };
    }

    await newListing.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","listing you requested does not exists")
       return res.redirect("/listings")
    }
    res.render("listings/edit",{listing})
}))

//update Route
router.put("/:id",validateListing,isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated !!!")
    res.redirect(`/listings/${id}`)
}))

//DELETE Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted")
    res.redirect("/listings")
})
)



module.exports=router;
