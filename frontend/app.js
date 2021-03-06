require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static('public'));


app.get('/',function(req,res){
  res.sendFile('index.html');
});



app.post('/test', (req, res) => {
  res.send("hello from backend");
})



app.use((err,req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send("Internal Error");
  // res.render('error', { error: err });
});

app.listen(process.env.PORT || 9000, ()=>{
  console.log("app is listening on port: ", process.env.PORT || 9000);
});