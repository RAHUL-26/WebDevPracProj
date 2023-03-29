const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");  
const https = require("https");

require("dotenv").config();

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
//to access static files
app.use(express.static("public"));
//public here is just a folder name containing the static css and image files

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
    
});


app.post("/",function(req,res){
   const firstName = req.body.first_name;
   const lastName = req.body.last_name;
   const email = req.body.email;

   const data ={
    members: [
        {
        email_address: email,
        status:"subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
        }
    ]
   };

   const jsonData = JSON.stringify(data);
   
   const UID_M=process.env.UID_M;
   const APIKey=process.env.APIKey;

   //console.log(UID_M+" "+APIKey);
  
  
   const url = "https://us21.api.mailchimp.com/3.0/lists/"+UID_M;


   const options={
    method: "POST",
    auth:"Rahul:"+APIKey
   }

   const request = https.request(url,options,function(response){
   
    if(response.statusCode===200)
    {
        res.sendFile(__dirname+"/success.html");
    }
    else
    {
        res.sendFile(__dirname+"/failure.html");
    }

    response.on('data',function(data){
        console.log(JSON.parse(data));
    });
   });

   request.write(jsonData);
   request.end();
//    console.log(firstName+" "+lastName+" "+email);
//    res.send(firstName+" "+lastName+" "+email);
});


app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server running at port 3000");
    
});

