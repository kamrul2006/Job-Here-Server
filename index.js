const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000


// --------------------middle ware-------------------------
app.use(cors())
app.use(express.json());

// ----------------connecting MONGO db---------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8jqou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // ---------------creating DATA BASE ON MONGO DB----------------------
        const JobCollection = client.db("JobDB").collection('All-Jobs')
        // const UserCollection = client.db("JobDB").collection('All-Users')


        //---------------------------Showing all jobs------------------------
        app.get('/allJobs', async (req, res) => {
            const cursor = JobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //-------------------add Job-------------------------------------------
        app.post('/Jobs', async (req, res) => {
            const newJob = req.body
            console.log(newJob)
            const result = await JobCollection.insertOne(newJob)
            res.send(result)
        })






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);




// -----------------------get the root rout----------------
app.get("/", (req, res) => {
    res.send('JOB IS FALLING FROM THE SKY.')
})

// -----------------------running on port---------------------
app.listen(port)