const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/Listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");  
//database  
const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js")//joi


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

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.datails.map((el)=>{
            el.message.join(",")
        })
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }

}

//index routev completed
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index",{allListings});
    }));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new")
})

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing})
}))

//create Route
app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}))

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing})
}))

//update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))

//DELETE Route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})
)
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

