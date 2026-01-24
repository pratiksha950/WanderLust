const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/Listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");  
const Review =require("./models/review.js");
//database  
const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")//joi

// const router=express.Router;
const listings=require("./routes/listing.js")


main().then(()=>{
    console.log("connected to mongoDB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
//for useues of static file basically css
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json());   

app.get("/",(req,res)=>{
    res.send("Hii i am Root")
})


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

app.use("/listings",listings)

//review
//  Post review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)

    listing.reviews.push(newReview._id);
    await newReview.save()
    await listing.save()

    res.redirect(`/listings/${listing._id}`)
})
)

//delete review Route
app.delete("/listings/:id/reviews/:reviewId",
    wrapAsync(async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findById(reviewId)
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

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

//midllware handle error
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
        // res.status(statusCode).send(message);
        res.status(statusCode).render("error.ejs",{message})
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

