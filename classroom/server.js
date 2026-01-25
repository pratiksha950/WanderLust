const express = require("express");
const app = express();
const users =require("./routes/user.js")
const posts =require("./routes/post.js")
const PORT = 3000;
const cookieParser=require("cookie-parser")
const session=require("express-session")
const flash=require("connect-flash")
const path=require("path")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOption=(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}))

app.use(sessionOption);
app.use(flash())

app.use((req,res,next)=>{
     res.locals.successMsg=req.flash("success");
     res.locals.errorMsg=req.flash("error");
    next()
})

app.get("/register",(req,res)=>{
  let {name="anonymous"}=req.query;
  req.session.name=name;
  if(name==="anonymous"){
    req.flash("error","user not occured")
  }else{
    req.flash("success","user register successfully")
  }

  res.redirect("/hello")
})

app.get("/hello",(req,res)=>{ 
  res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqcount",(req,res)=>{
//   if(req.session.count){
//     req.session.count++
//   }else{
//     req.session.count=1
//   }
//   res.send(`you send a request ${req.session.count} times `)
// })



// app.get("/test",(req,res)=>{
//   res.send("test succeessful")
// })

// app.use(cookieParser("secretecose"))

// app.get("/getcookies",(req,res)=>{
//     res.cookie("made-in-china","india",{signed:true})
//     res.send("signed cookie send")
// })

// app.get("/verify",(req,res)=>{
//   console.log(req.signedCookies);
//   res.send("verified")
// })



// app.get("/getcookies",(req,res)=>{
//   res.cookie("greet","hello");
//    res.cookie("goo","hello")
    
//   res.send("send you some cookies")
// })

// app.get("/greet",(req,res)=>{
//   let {name="anonymous"}=req,cookies;
//   res.send(`hi i am greet ${name}`)
// })

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi, I am root 🚀");
// });

// app.use("/users",users)
// app.use("/posts",posts)




app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
