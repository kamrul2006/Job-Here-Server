const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const ApplyCollection = client.db("JobDB").collection('All-Apply')


        //---------------------------Showing all jobs------------------------
        app.get('/allJobs', async (req, res) => {
            const cursor = JobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //-------------------add Job------------------------------------------
        app.post('/allJobs', async (req, res) => {
            const newJob = req.body
            // console.log(newJob)
            const result = await JobCollection.insertOne(newJob)
            res.send(result)
        })

        //---------------------------Get Job by ID-----------------------------
        app.get('/allJobs/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await JobCollection.findOne(query)
            res.send(result)
        })




        //-------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------



        //-------------------add Apply-----------------------------------------
        app.post('/apply', async (req, res) => {
            const newApply = req.body
            //  console.log(newVisa)
            const result = await ApplyCollection.insertOne(newApply)

            //-not the best way to get the application count
            const id = newApply.job_id
            const query = { _id: new ObjectId(id) }
            const job = await JobCollection.findOne(query)

            console.log(job)

            let jobCount = 0

            if (job.applyCount == true) {
                jobCount = job.applyCount + 1
            }
            else {
                jobCount = 1
            }

            //---updating the job count
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    applyCount: jobCount
                }
            }

            const updatedResult = await JobCollection.updateOne(filter, updatedDoc)

            res.send(result)

        })

        //---------------------------Showing all Apply------------------------
        app.get('/apply', async (req, res) => {
            //------------------------------Search here---------------------------
            const { Search } = req.query;
            let option = {}
            if (Search) {
                option = { countryName: { $regex: Search, $options: "i" } }
            }
            const cursor = ApplyCollection.find(option)
            const result = await cursor.toArray()
            res.send(result)
        })

        //---------------------------Get apply by ID-----------------------
        app.get('/apply/:id', async (req, res) => {
            const id = req.params.id
            //  console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await ApplyCollection.findOne(query)
            res.send(result)
        })

        //---------------------------Get apply by ID to show users-----------------------
        app.get('/apply/applicant/:job_id', async (req, res) => {
            const id = req.params.job_id
            //  console.log(id)
            const query = { job_id: id }
            const result = await ApplyCollection.find(query).toArray()
            res.send(result)
        })

        //---------------------------Get apply by ID-----------------------
        app.patch('/apply/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body.status
            //  console.log(id)
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: data
                }
            }
            const result = await ApplyCollection.updateOne(query, updatedDoc)
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