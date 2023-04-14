require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// const secret = process.env.SECRET;
//console.log(secret);
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser = new User({
            email:req.body.username,
           // password:md5(req.body.password)
           password:hash
        });
    
        newUser.save().then(savedUser=>{
            if(savedUser===newUser)
            {
                console.log("New User Saved");
                res.render("secrets");
            }
            else{
                res.send("Some error occured");
            }
    
        });
    });
 
});

app.post("/login",async function(req,res){
    const email = req.body.username;
    //const password=md5(req.body.password);
    const password=(req.body.password);

    const foundUser = await User.findOne({email:email}).exec();

    if(foundUser)
    {

        bcrypt.compare(password,foundUser.password,function(err,matched){
            if(matched){
                res.render("secrets");
            }
            else{
                    res.send("Incorrect Password!");
                }
        });
        // if(foundUser.password===password)
        // {
        //     res.render("secrets");
        // }else{
        //     res.send("Incorrect Password!");
        // }
    }
    else{
        res.send("User not found!");
    }
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});