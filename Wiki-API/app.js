const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");
const ejs = require("ejs");


const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article",articleSchema);

app.get("/articles",async function(req,res){

    const articles = await Article.find({});
    res.send(articles);
});

app.post("/articles",function(req,res){

    const newTitle = req.body.title;
    const newContent = req.body.content;
//  console.log(newTitle);
//  console.log(newContent);

const newArticle = new Article({
    title:newTitle,
    content:newContent
});

newArticle.save().then(function(){
    res.send("New article got added successfully.")
}).catch(function(err){
    res.send(err);
});

});

app.delete("/articles",async function(req,res){

  await Article.deleteMany({}).then(function(){
    res.send("Successfully deleted all the articles.");
  }).catch(function(err){
    res.send(err);
  });
  
});

app.listen(3000,function(){
    console.log("Server running at port 3000");
});