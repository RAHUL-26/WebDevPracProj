require("dotenv").config();
const express = require('express');
const https = require('https');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    //res.send("Server is up and running");
   res.sendFile(__dirname+"/index.html");
}); 

app.post("/",function(req,res){

    const city = req.body.city;
    const apiKey= process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid="+apiKey+"#";
    
https.get(url,function(response){
    console.log(response.statusCode);

    response.on('data',function(data){
        const weatherData = JSON.parse(data);  
        const weatherDescription=weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png";


        res.write("<h1>The temp here is "+temp+" degree Celcius</h1>");
        res.write("<h3>Weather is "+weatherDescription+"</h3>");
        res.write("<img src="+imageURL+">");
        res.send();
        // const object={
        //     name: "Rahul",
        //     Age: 23
        // }
         //JSON.stringify(object); does--> {"name":"Rahul","Age":"23"};
    });
});

});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});