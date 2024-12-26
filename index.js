const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000


// --------------------middle ware-------------------------
app.use(cors({
    origin: ['http://localhost:5173',],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// // ------------------------------------------
// const logger = (req, res, next) => {
//     console.log('inside the logger')
//     next()
// }

// const tokenVerify = (req, res, next) => {
//     const token = req?.cookies?.token
//     console.log('inside the tokenVerify part', token)

//     if (!token) {
//         return res.status(401).send({ massage: "Unauthorized access" })
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error('JWT Verification Error:', err.message);
//             return res.status(403).send({ message: "Forbidden: Invalid or Expired Token" });
//         }
//         req.user = decoded;
//         next();
//     });

// }

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
        const HistoCollection = client.db("CraftDB").collection('All-Crafts')
        // const ApplyCollection = client.db("JobDB").collection('All-Apply')

        // ---auth related Apis-------------------------------
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"
                })
                // .send(token)
                .send({ success: true })
        })

        app.post('/logout', (req, res) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"
            }).send({ tokenRemoved: true })
        })


        //---------------------------Showing all craft------------------------
        app.get('/allCraft', async (req, res) => {
            // console.log('inside all jobs')
            const cursor = HistoCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // //-------------------add Craft------------------------------------------
        // app.post('/allCraft', async (req, res) => {
        //     const newCraft = req.body
        //     // console.log(newJob)
        //     const result = await HistoCollection.insertOne(newCraft)
        //     res.send(result)
        // })

        // //---------------------------Get craft by ID-----------------------------
        // app.get('/allCraft/:id', async (req, res) => {
        //     const id = req.params.id
        //     // console.log(id)
        //     const query = { _id: new ObjectId(id) }
        //     const result = await HistoCollection.findOne(query)
        //     res.send(result)
        // })




        //-------------------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------



        // //-------------------add Apply-----------------------------------------
        // app.post('/apply', async (req, res) => {
        //     const newApply = req.body
        //     //  console.log(newVisa)
        //     const result = await ApplyCollection.insertOne(newApply)

        //     //-not the best way to get the application count
        //     const id = newApply.job_id
        //     const query = { _id: new ObjectId(id) }
        //     const job = await HistoCollection.findOne(query)

        //     console.log(job)

        //     let jobCount = 0

        //     if (job.applyCount) {
        //         jobCount = job.applyCount + 1
        //     }
        //     else {
        //         jobCount = 1
        //     }

        //     //---updating the job count
        //     const filter = { _id: new ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             applyCount: jobCount
        //         }
        //     }

        //     const updatedResult = await HistoCollection.updateOne(filter, updatedDoc)

        //     res.send(result)

        // })

        // //---------------------------Showing all Apply------------------------
        // app.get('/apply', tokenVerify, async (req, res) => {
        //     const QEmail = req.query.email
        //     const query = { email: QEmail }

        //     // console.log(QEmail)
        //     // console.log(req.user.email)

        //     if (req.user.email !== req.query.email) {
        //         return res.status(403).send({ massage: "forbidden" })
        //     }

        //     const cursor = await ApplyCollection.find(query).toArray()
        //     // const result = cursor
        //     // console.log(cursor)
        //     res.send(cursor)
        // })

        // //---------------------------Get apply by ID-----------------------
        // app.get('/apply/:id', async (req, res) => {
        //     const id = req.params.id
        //     //  console.log(id)
        //     const query = { _id: new ObjectId(id) }
        //     const result = await ApplyCollection.findOne(query)
        //     res.send(result)
        // })

        // //---------------------------Get apply by ID to show users-----------------------
        // app.get('/apply/applicant/:job_id', async (req, res) => {
        //     const id = req.params.job_id
        //     //  console.log(id)
        //     const query = { job_id: id }
        //     const result = await ApplyCollection.find(query).toArray()
        //     res.send(result)
        // })

        // //---------------------------Get apply by ID-----------------------
        // app.patch('/apply/:id', async (req, res) => {
        //     const id = req.params.id
        //     const data = req.body.status
        //     //  console.log(id)
        //     const query = { _id: new ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             status: data
        //         }
        //     }
        //     const result = await ApplyCollection.updateOne(query, updatedDoc)
        //     res.send(result)
        // })




        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);




// -----------------------get the root rout----------------
app.get("/", (req, res) => {
    res.send('All the history are here.')
})

// -----------------------running on port---------------------
app.listen(port)