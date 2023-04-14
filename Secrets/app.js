require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(session({
    secret:"Our littile secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    googleId: String,
    secret: String
});

// const secret = process.env.SECRET;
//console.log(secret);
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    const user = User.findById(id).exec();
            done(null,user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {

    //console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
    res.render("home");
});

app.get("/auth/google",
    passport.authenticate("google", {scope: ["profile"]})
);

app.get("/auth/google/secrets",
passport.authenticate('google',{failureRedirect:"/login"}),
function(req,res){
    //Successful authentication , redirect to secrets
    res.redirect("/secrets");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",async function(req,res){
    // if(req.isAuthenticated()){
    //     res.render("secrets");
    // }else{
    //     res.redirect("/login");
    // }
    const usersWithSecrets=await User.find({"secret":{$ne: null}}).exec();
    
    // console.log(usersWithSecrets);
    if(usersWithSecrets){
        res.render("secrets",{usersWithSecrets:usersWithSecrets});
    }
    else{
        res.send("Something went wrong!");
    }
});

app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
});

app.post("/submit",async function(req,res){
 const submittedSecret = req.body.secret;
 //console.log(submittedSecret);
 const user = await req.user;
 //console.log(user);

  const foundUser = await User.findById(user.id).exec();

//  console.log(foundUser);

  if(foundUser)
  {
    user.secret=submittedSecret;
    await user.save().then(savedUser => {
        if(savedUser === user){
            res.redirect("/secrets");
        };
    });
  }
  else{
    res.send("Something went wrong!");
  }
});

app.get("/logout",function(req,res){
    req.logout(function(err){
        if(err){console.log(err);}
        else{
            res.redirect("/");
        }
    });
});

app.post("/register",function(req,res){

    User.register({username: req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        }
    });

    // bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    //     const newUser = new User({
    //         email:req.body.username,
    //        // password:md5(req.body.password)
    //        password:hash
    //     });
    
    //     newUser.save().then(savedUser=>{
    //         if(savedUser===newUser)
    //         {
    //             console.log("New User Saved");
    //             res.render("secrets");
    //         }
    //         else{
    //             res.send("Some error occured");
    //         }
    
    //     });
    // });
 
});

app.post("/login",async function(req,res){

    const user = new User({
        username:req.body.username,
        password: req.body.password
    });


    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });

        }
    });
    // const email = req.body.username;
    // //const password=md5(req.body.password);
    // const password=(req.body.password);

    // const foundUser = await User.findOne({email:email}).exec();

    // if(foundUser)
    // {

    //     bcrypt.compare(password,foundUser.password,function(err,matched){
    //         if(matched){
    //             res.render("secrets");
    //         }
    //         else{
    //                 res.send("Incorrect Password!");
    //             }
    //     });
    //     // if(foundUser.password===password)
    //     // {
    //     //     res.render("secrets");
    //     // }else{
    //     //     res.send("Incorrect Password!");
    //     // }
    // }
    // else{
    //     res.send("User not found!");
    // }
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});