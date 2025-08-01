require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 1000

// Middlewere
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqjjaiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        const campaignDB = client.db('CampaignDB')
        const campaignCollection = campaignDB.collection('allCampaign')


        app.get('/', (req, res) => {
            res.send('CROWDCUBE database is running')
        })
        app.get('/campaigns', async (req, res) => {
            const result = await campaignCollection.find().toArray();
            res.send(result);
        });
        app.get('/campaign/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }

            const result = await campaignCollection.findOne(quary)
            res.send(result)
        })

        app.post('/campaigns', async (req, res) => {
            const campaignInfo = req.body;
            const result = await campaignCollection.insertOne(campaignInfo)

            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.listen(port)