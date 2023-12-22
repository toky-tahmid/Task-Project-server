const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khqul4z.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const TaskCollection = client.db("taskDB").collection("alltasks");
   
app.get("/alltasks", async (req, res) => {
    const result = await TaskCollection.find().toArray();
    res.send(result);
  }); 

  app.get("/alltask/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await TaskCollection.findOne(query);
    res.send(result);
  });

  app.post("/allTasks", async (req, res) => {
    try {
      const data = req.body; // Get the entire request body as data
      const result = await TaskCollection.insertOne(data);
      res.json({ insertedId: result.insertedId });
    } catch (error) {
      console.error('Error inserting task:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.delete("/allTasks/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await TaskCollection.deleteOne(query);
    res.send(result);
  });
  app.put("/alltasks/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const option = { upsert: true };
    const updateJobTask = req.body;
    const update = {
      $set: {
        title: updateJobTask.title,
        deadline: updateJobTask.deadline,
        description: updateJobTask.description,
        priority: updateJobTask.priority,
        status: updateJobTask.status,
        startDate: updateJobTask.startDate,
      }
    }
    const result = await TaskCollection.updateOne(filter, update, option)
    res.send(result)
  })
  app.put("/alltask/:id", async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status;
  
    try {
      const result = await TaskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: newStatus } }
      );
  
      res.json(result);
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task is on");
});

app.listen(port, () => {
  console.log(`Survey are going ${port}`);
});
