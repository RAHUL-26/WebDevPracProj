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

app.route("/articles")
.get(async function(req,res){

    const articles = await Article.find({});
    res.send(articles);
})

.post(function(req,res){

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
})

.delete(async function(req,res){

  await Article.deleteMany({}).then(function(){
    res.send("Successfully deleted all the articles.");
  }).catch(function(err){
    res.send(err);
  });

});


/////////////////////////For specific articles//////////////
app.route("/articles/:title")
.get(async function(req,res){
    const title = req.params.title;
    
    const found = await Article.findOne({title:title}).exec(); 
    if(found===null){
        res.send("Article does not exist.");
    }else{
        res.send(found);
    }
})

.put(async function(req,res){
    const title = req.params.title;

    const upadteArticle = await Article.updateOne(
        {title:title},
        {title:req.body.title,content:req.body.content},
        );
        
        res.send(upadteArticle.matchedCount+" articles matched. "+upadteArticle.modifiedCount+" articles updated.");
        
})

.patch(async function(req,res){
    const title = req.params.title;

    const updatedArticle = await Article.updateOne(
        {title:title},
        {$set: req.body}
    );

    res.send(updatedArticle.matchedCount+" articles matched. "+updatedArticle.modifiedCount+" articles updated.");

})

.delete(async function(req,res){

    const title = req.params.title;
    const deleted = await Article.deleteOne({title:title});

    res.send(deleted.deletedCount+" article(s) deleted.");
});

app.listen(3000,function(){
    console.log("Server running at port 3000");
});