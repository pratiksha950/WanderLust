const express = require("express");
const app = express();
const users =require("./routes/user.js")
const posts =require("./routes/post.js")
const PORT = 3000;
const cookieParser=require("cookie-parser")

app.use(cookieParser())

app.get("/getcookies",(req,res)=>{
  res.cookie("greet","hello");
   res.cookie("goo","hello")
    
  res.send("send you some cookies")
})

app.get("/greet",(req,res)=>{
  let {name="anonymous"}=req,cookies;
  res.send(`hi i am greet ${name}`)
})

app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi, I am root 🚀");
});

app.use("/users",users)
app.use("/posts",posts)



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
