const express = require('express');//from node modules

const app = express();//an express js application __instance of an express js application ______ an web server


app.listen(3000 , ()=>{console.log("successfully listening on port 3000")});//port no to listening from a express server on port 3000
 

//request , response handler
app.use("/hello",(req, res) => { res.send("hello from the server") });