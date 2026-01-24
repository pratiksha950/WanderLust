const express = require("express");
const app = express();
const users =require("./routes/user.js")
const posts =require("./routes/post.js")
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hi, I am root 🚀");
});

app.use("/users",users)
app.use("/posts",posts)



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
