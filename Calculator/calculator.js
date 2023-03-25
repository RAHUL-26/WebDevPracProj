const express = require('express');
const bodyParser = require('body-parser'); //body-parser allows to parse the data we get from the post request

const app = express();
app.use(bodyParser.urlencoded({extended: true})); //also has bodyParser.txt , bodyParser.json() //extented allows us to post nested objects
//to recieve data from html file

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html"); //sends the index.html file
   // console.log(__dirname);// gives the path location of the current file ->  C:\Users\RAHUL\OneDrive\desktop\WebDevMiniProjects\Calculator
});

app.post('/',function(req,res){   ///handles post request
    
    //from body-parser
    //req.body returns => {num1: '2', num2: '3', submit:''}
    var num1=Number(req.body.num1); //num1 num2 is because of the name fiven in html (see)
    var num2=Number(req.body.num2);
    //
    res.send("Sum of "+num1+"and "+num2+" is = "+(num1+num2));
});

//BMI
app.get('/bmicalculator',function(req,res){
  res.sendFile(__dirname+"/bmiCalculator.html");
});

app.post('/bmicalculator',function(req,res){
  var weight = parseFloat(req.body.weight);
  var height = parseFloat(req.body.height);
  
  var bmi = (weight/(height*height)).toFixed(2); 
  res.send("Your BMI is "+bmi);
});
//
app.listen(3000,function(){
    console.log("Server started on port 3000"); //  
});