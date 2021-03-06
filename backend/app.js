require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var cors = require('cors');
app.use(cors());


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


const memesRouter = require("./route/memesRouter");


app.get('/',function(req,res){
  res.send("hello from backend!");
});



/**
 * all request to /meme will be handle by memeRouter
 */
app.use('/memes', memesRouter);

app.use((req, res) => {
  res.status(404).send('PAGE NOT FOUND');
});

app.use((err,req, res, next) => {
  res.status(500).send('Internal Server Error Occurred');

});

app.listen(process.env.PORT || 8081, ()=>{
  console.log("app is listening on port: ", process.env.PORT || 8081);
});