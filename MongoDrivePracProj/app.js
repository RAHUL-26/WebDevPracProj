const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://localhost:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
//insertOne()

// const myDB = client.db("testDriverDB");
// const myColl = myDB.collection("test");
// const doc = { name: "Rahul", age: 23 };
// const result = await myColl.insertOne(doc);
// console.log(
//    `A document was inserted with the _id: ${result.insertedId}`,
// );

//insertMany()
 const myDB = client.db("testMany");
 const myColl = myDB.collection("testM");
// const docs = [
//     { name: "Rahul", age: 23 },
//     { name: "Rohit", age: 20 },
//     { name: "Some", age: 10 }
// ];
// const insertManyresult = await myColl.insertMany(docs);
// let ids = insertManyresult.insertedIds;
// console.log(`${insertManyresult.insertedCount} documents were inserted.`);
// for (let id of Object.values(ids)) {
//    console.log(`Inserted a document with id ${id}`);
// }


//find()

//const findResult = await myColl.find(); //gives all data in testM collection
  const findResult = await myColl.find(   //gives data in testM collection with name "Rahul"
    {name:"Rahul"}
  );
  await findResult.forEach(console.dir);

} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  
}
run().catch(console.dir);
