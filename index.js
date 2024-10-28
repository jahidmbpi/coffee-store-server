const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g8zp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Create the coffee collection object
    const coffeCollection = client.db("coffe_DB").collection("coffee");
    const userCollection = client.db("coffe_DB").collection("user");

    // POST request to add coffee data
    app.get("/coffe", async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffe", async (req, res) => {
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeCollection.insertOne(newCoffe);
      res.send(result);
    });

    app.delete("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const queary = { _id: new ObjectId(id) };
      const result = await coffeCollection.deleteOne(queary);
      res.send(result);
    });

    app.put("/coffe/:id", async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      const queary = { _id: new ObjectId(id) };
      const upDatedCoffe = req.body;
      const coffe = {
        $set: {
          name: upDatedCoffe.name,
          Details: upDatedCoffe.Details,
          photo: upDatedCoffe.photo,
          supplier: upDatedCoffe.supplier,
          Taste: upDatedCoffe.Taste,
          Category: upDatedCoffe.Category,
          quantity: upDatedCoffe.quantity,
        },
      };
      const result = await coffeCollection.updateOne(queary, coffe, options);
      res.send(result);
    });

    //  post for firebase create user

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // read user data firebase
    app.get("/user", async (req, res) => {
      const queary = userCollection.find();
      const result = await queary.toArray();
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("coffe making server is runnuing ");
    });

    // Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Uncomment this if you want to close the client connection after operations
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffe server is running on port: ${port}`);
});
