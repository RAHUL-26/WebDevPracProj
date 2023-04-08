const express = require("express");
const bodyParser=require("body-parser");

const mongoose = require("mongoose");

//const date=require(__dirname+"/date.js");
//now date contains the getDate function declared inside the date.js module

const app = express();

var newTodos=["Do EJS","Do Leetcode","Revise"];   //var newTodo=""; overwrites , so use array
var newWorks=[];
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
name:String
});

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name:"Item 1"
});

const item2 = new Item({
    name: "Item 2"
})

const item3 = new Item({
    name: "Item 3"
})


const defaultItems = [item1,item2,item3];


app.get("/",async function(req,res){
    // var date = new Date();

    // var options = {
    //     weekday:"long",
    //     day: "numeric",
    //     month: "long"
    // };
    //* above part inside the date module

    // var day = date.toLocaleDateString("en-US",options);

    // console.log(day);

    // if(date.getDay()==0||date.getDay()==6)
    // {
    //     day ="Weekend";
    // }
    // else
    //     day = "Weekday";

    // let day=date.get();
    // let day=date.getDay();
    
    const allTodoItems = await Item.find();

    console.log(allTodoItems);
    if(allTodoItems.length===0)
    {
        Item.insertMany(defaultItems).then(function(){
            console.log("Default Data Inserted");
        }).catch(function(err){
            console.log(err);
        });

        res.redirect("/");
    }
    else{
        res.render("list",{listTitle: "Today", newListItems:allTodoItems});  //seaches for list.ejs file inside the views folder and replace the key variable with the pair value
    }
 });

app.post("/",function(req,res){

    //console.log(req.body);

    if(req.body.button==='Work List')
    {
        var newWork = req.body.new_todo;
        newWorks.push(newWork);
        res.redirect("/work");
    }
    else{
    var newTodo = req.body.new_todo;

    const newTodoItem = new Item({
        name:newTodo
    });
    
    newTodoItem.save();
    
   // newTodos.push(newTodo);
    res.redirect("/");
    }
    // res.render("list",{newlistItem:newTodo});
});

app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List", newListItems:newWorks});
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(){
 console.log("Server started on Port 3000");
});