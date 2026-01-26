const express = require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const Listing =require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} =require("../views/middleware/middleware.js")

const ListingController=require("../controllers/listing.js")


//index route completed
router.get("/",wrapAsync(ListingController.index));

//new route
router.get("/new",isLoggedIn,ListingController.renderNewForm)

//show route
router.get("/:id",wrapAsync(ListingController.showListing))

//create Route
router.post("/", validateListing,isLoggedIn, wrapAsync(ListingController.createListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))

//update Route
router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(ListingController.updateListing))

//DELETE Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing)
)

module.exports=router;
