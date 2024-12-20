const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.get('/',(req, res) => {
  res.send("Job Portal Is Running in it's server side")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t89ec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
  const jobsCollection = client.db("jobPortal").collection("jobs");
  const jobApplyCollection = client.db("jobPortal").collection("job-Application")

  app.get("/jobs",async(req,res)=>{
    const cursor = jobsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.get("/jobs/:id",async(req,res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id)}
    const result = await jobsCollection.findOne(query);
    res.send(result);
  })

  //job application apis
  // app.get("/job-applications",async(req,res)=>{
  //   const cursor = jobApplyCollection.find();
  //   const result = await cursor.toArray();
  //   res.send(result);
  // })
  
  app.get("/job-applications",async(req,res)=>{
    const email = req.query.email;
    const query = {applicant_email: email}
    const result = await jobApplyCollection.find(query).toArray();
    res.send(result);
  })

  app.post("/job-applications",async(req, res) => {
    const application = req.body
    const result = await jobApplyCollection.insertOne(application);
    res.send(result);
  })

  



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
  console.log(`Job Portal Server Side Is running at ${port}`)
})