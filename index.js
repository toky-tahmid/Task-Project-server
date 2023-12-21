const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
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
    // const userCollection = client.db("survey").collection("users");
    
    //jwt
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    // });

    // app.put('/users', async(req, res) => {
    //   let query = {};
    //   let updatedUser = {}
    //   if (req.query.email) {
    //     query = { email: req.query.email };
    //     updatedUser={ 
    //       $set:{ role: 'prouser'}
    //     }
    //   }
    //   const result = await userCollection.findOneAndUpdate(query, updatedUser);
    //   res.send(result);
    // })
    //payments
    // app.post("/payments", async (req, res) => {
    //   const user = req.body;
    //   const result = await paymentCollection.insertOne(user);
    //   res.send(result);
    //   console.log(user);
    // });
    // app.get("/payments", async (req, res) => {
    //   const result = await paymentCollection.find().toArray();
    //   res.send(result);
    // });
    //users data
    // app.get("/users", async (req, res) => {
    //   const result = await userCollection.find().toArray();
    //   res.send(result);
    // });

    // app.patch("/users", async (req, res) => {
    //   const role = req.query.role;
    //   const id = req.query.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedDoc = {
    //     $set: {
    //       role: role,
    //     },
    //   };
    //   const result = await userCollection.updateOne(filter, updatedDoc);
    //   res.send(result);
    // });
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });
    //All surveys
    // 
    // app.get("/allSurveys/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await surveyCollection.findOne(query);
    //   res.send(result);
    // });
  //   app.get('/pendingSurvey', async (req, res) => {
  //     let query = {}
  //     if (req.query?.pending) {
  //         query = { pending: req.query.pending }
  //     }
  //     const result = await surveyCollection.find(query).toArray();
  //     res.send(result)
  // })
  //   app.get('/publisedSurvey', async (req, res) => {
  //     let query = {}
  //     if (req.query?.pending) {
  //         query = { pending: req.query.pending }
  //     }
  //     const result = await surveyCollection.find(query).toArray();
  //     res.send(result)
  // })

//   app.patch("/user", async (req, res) => {
//     const id = req.query.id;
//     const filter = { _id: new ObjectId(id) };
//     const updatedDoc = {
//         $set: {
//           pending: "Publish",
//         },
//     };
//     const result = await surveyCollection.updateOne(filter, updatedDoc);
//     res.send(result);
// });
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
 
 

    // app.put("/allSurveys/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const update = { $inc: { total_votes: 1 } };
    //   const result = await surveyCollection.updateOne(filter, update);
    //   res.send(result);
    // });

    // app.post("/api/add-review", async (req, res) => {
    //   try {
    //     const { review_id, reviews } = req.body;
    //     console.log(review_id, reviews);
    //     const result = await surveyCollection.updateOne(
    //       { _id: new ObjectId(review_id) },
    //       { $push: { reviews: { $each: reviews } } }
    //     );
    //     res
    //       .status(200)
    //       .json({ success: true, message: "Review added successfully" });
    //   } catch (error) {
    //     console.error("Error adding review:", error);
    //     res
    //       .status(500)
    //       .json({ success: false, message: "Error adding review" });
    //   }
    // });
    // app.post("/api/add-feedback", async (req, res) => {
    //   try {
    //     const { review_id, feedback } = req.body;
    //     console.log(review_id, feedback);
    //     const result = await surveyCollection.updateOne(
    //       { _id: new ObjectId(review_id) },
    //       { $push: { review: { $each: feedback } } }
    //     );
    //     res
    //       .status(200)
    //       .json({ success: true, message: "Review added successfully" });
    //   } catch (error) {
    //     console.error("Error adding review:", error);
    //     res
    //       .status(500)
    //       .json({ success: false, message: "Error adding review" });
    //   }
    // });


    // app.put("/dashboard/updateSurvey/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const option = { upsert: true };
    //   const SurveyUpdate = req.body;
    //   const update = {
    //     $set: {
    //       title: SurveyUpdate.title,
    //       short_description: SurveyUpdate.short_description,
    //       long_description: SurveyUpdate.long_description,
    //     },
    //   };
    //   const result = await surveyCollection.updateOne(filter, update, option);
    //   res.send(result);
    // });
   




    
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
