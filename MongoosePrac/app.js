const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/testMongoose'); //create connection and db

const testSchema = new mongoose.Schema({  //building the test schema
    name:String,
    age:Number,
    know:String
});

const FruitSchema = new mongoose.Schema({
    name:String,
    rating: Number,
    review:String
});


const testSchema2 = new mongoose.Schema({  //building the test schema2 with validation constraints
    name: {
        type:String,
        required: [true,"Name not specified"]
    },
    age: {
        type:Number,
        min:20,
        max:30
    },
    know:String,

    favouriteFruit: FruitSchema
});


const Fruit = mongoose.model("Fruit",FruitSchema);

const mango = new Fruit({
    name:"Mango",
    rating:5,
    review:"Awesome Fruit!"
});

//mango.save();

const guava = new Fruit({
    name:"Guava",
    rating:5,
    review:"Nice fruit!"
});

//guava.save();

const Person = mongoose.model("Person",testSchema2); //creates people collection under testMongoose db

const person = new Person({
    name:"Rahul",
    age:23,
    know:"yes",
    favouriteFruit:mango
});

//person.save(); //inserting person

const person2 = new Person({
    name:"Rohit",
    age:20,
    know:"yes",
    favouriteFruit:guava
});

//person2.save();

const person3 = new Person({
    name:"Some3",
    age:10,
    know:"no"
});

const person4 = new Person({
    name:"Some4",
    age:30,
    know:"no"
});

const person5 = new Person({
    name:"Some5",
    age:20,
    know:"yes"
});

///insertMany()
// Person.insertMany([person3,person4,person5]).then(function(){
//     console.log("Data inserted")  // Success
// }).catch(function(error){
//     console.log(error)      // Failure
// });

//READ
let readPersonData=[];
async function readPerson(){
const cursor = Person.find().cursor();
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    readPersonData.push(doc);
    //console.log(doc); // Prints documents one at a time
}

//mongoose.connection.close();//close connection

readPersonData.forEach(function(person){
    console.log(person.name);
});
}
readPerson();



////////****error -> 'Model.find() no longer accepts a callback' */
// Person.find({name:"Rahul"},function(err,person){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(person);
//     }
// });
////////////////////////////////////////////////////////////

//UPDATE
// Person.updateOne({name:"Some5"},{name:"Anonymous"}).then(function(){
//     console.log("Name of Some5 updated to Anonymous");  // Success
// }).catch(function(error){
//     console.log(error)      // Failure
// });

//DELETE
// Person.deleteOne({name:"Anonymous"}).then(function(){
//     console.log("Anonymous Deleted");
// }).catch(function(err){
//     console.log(err);
// });

