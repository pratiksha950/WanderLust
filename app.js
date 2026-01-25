const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");  
//database  
const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust";
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session")
const listings=require("./routes/listing.js") 
const reviews=require("./routes/review.js")
const flash=require("connect-flash")

const sessionoptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true   
    }
}

app.use(session(sessionoptions))
app.use(flash())

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

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    next()
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)


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

