const express = require("express");
const bodyParser=require("body-parser");

const mongoose = require("mongoose");
const _ = require("lodash");

//const date=require(__dirname+"/date.js");
//now date contains the getDate function declared inside the date.js module

const app = express();
require("dotenv").config();

var newTodos=["Do EJS","Do Leetcode","Revise"];   //var newTodo=""; overwrites , so use array
var newWorks=[];
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

const USER_ID_PASS=process.env.USER_ID_PASS;

mongoose.connect("mongodb+srv://"+USER_ID_PASS+"@cluster0.bexazrs.mongodb.net/myFirstDatabase");

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
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);



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

    //console.log(allTodoItems);
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

app.post("/",async function(req,res){

    //console.log(req.body);

    // if(req.body.button==='Work List')
    // {
    //     var newWork = req.body.new_todo;
    //     newWorks.push(newWork);
    //     res.redirect("/work");
    // }
    // else{
    const newTodo = req.body.new_todo;
    const listName = req.body.button;
    
    const newTodoItem = new Item({
        name:newTodo
    });
    
    if(listName==="Today"){
        newTodoItem.save();
        res.redirect("/");
    }
    else{
        console.log(listName);
        const found = await List.findOne({name:listName}).exec();
        //console.log(found);
        found.items.push(newTodoItem);
                found.save();
                res.redirect("/"+listName);
    }

    
    
   
    
   // newTodos.push(newTodo);
    //}
    // res.render("list",{newlistItem:newTodo});
});

app.post("/delete",async function(req,res){
  //console.log(req.body.checkbox);

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  
  if(listName==="Today")
  {
    Item.deleteOne({_id:checkedItemId}).then(function(){
        console.log(checkedItemId+" deleted");
      }).catch(function(err){
        console.log(err);
      });
    
      res.redirect("/");
    
  }
  else{
    const found = await List.findOneAndUpdate(
        {name:listName},
        {$pull:{items:{_id:checkedItemId}}}
        );
     //console.log(found);
     res.redirect("/"+listName);
  }


});

app.get("/:customListName",async function(req,res){
    const requestedListPage = _.capitalize(req.params.customListName);
    
    const found = await List.findOne({name:requestedListPage}).exec();
     console.log(found);
    if(found===null)
    {
        const newList = new List({
            name:requestedListPage,
            items:defaultItems
        });
        newList.save();
        res.redirect("/"+requestedListPage);
    }
    else{
        res.render("list",{listTitle:found.name,newListItems:found.items}); 
    }

});
// app.get("/work",function(req,res){
//     res.render("list",{listTitle: "Work List", newListItems:newWorks});
// });

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000,function(){
 console.log("Server started on Port 3000");
});