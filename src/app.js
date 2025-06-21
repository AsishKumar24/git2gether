const express = require('express');//from node modules

const app = express();//an express js application __instance of an express js application ______ an web server

//sending response type data in response
// app.get('/user', (req, res) => {
//     res.send({
//         firstname: "Asish",
//         lastname: "kumar"
//     })
// })
// /abc , /ac
// app.get('/abc', (req, res) => {
//   res.send({
//     firstname: 'Asish',
//     lastname: 'kumar'
//   })
// })
// //  /ac compulsory b should be included and /abc /abbbc /abcc(x)
// app.get('/abc', (req, res) => {
//     res.send({
//       firstname: 'Asish',
//       lastname: 'kumar'
//     })
//   })


// app.post("/user", (req, res) => {
//     res.send("Data Succesfully saved to database");
// })



// app.get('/user', (req, res) => {
//     //req.query print value from key-value
//     //req.params used for consoling params
//     //"/user/:userId/:name" userid and name are params
//   console.log(req.query)
//   res.send({
//     firstname: 'Asish',
//     lastname: 'kumar'
//   })
// })


//request , response handler

//this below is a wildcard code
//use can be get or post

// app.use('/', (req, res) => {
//   res.send('Asish Kumar')
// })

// app.use('/hello/2', (req, res) => {
//   res.send('hello from  server')
// })

// app.use('/hello', (req, res) => {
//   res.send('hello from the server')
// })

//if used "/" will never listen to any other /xyz
//anything comes after / it wont listen to any other handlers , it will always listen to the initial response
//for example "/" anything after this will be listened by the handler here
//for example "/hello" "/hello/xyz" will listen to "/hello"
//there is a catch "/hello" , "/hellloxysa" this will become another string so / this is importtant
app.listen(3000, () => {
  console.log('successfully listening on port 3000')
})
//port no to listening from a express server on port 3000

//there can be multiple route handler
//res.send is necessary otherwise it would be stuck in an infinite loop by the client

// app.use('/', (req, res, next) => {
//   next();
// })

// app.use("/user",
//   (req, res, next) => {
//     //if there are no response from first cb then next will be used
    
//     //res.send("hi 1");   //this is not the correct way to o/p because js engine would throw error
//     next();

    
//   },
//   (req, res) => {
//     res.send("hello2");
//     //next(); //
//   }
// );

app.use("/user", (req, res) => {
  res.send("asis")
});
app.use('/', ( req, res, next) => {
  res.send("asish")
  // next();
})



