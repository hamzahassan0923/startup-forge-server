const express = require('express');
const app = express()
const cors = require('cors')
const port = 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = process.env.MONGODB_URI
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
        await client.connect();


        const database = client.db('startup-forge-auth');
        const startupCollection = database.collection('opportunities');

        app.get('/api/opportunities', async (req, res) => {
            const query = {};
            console.log(req.query)
            if(req.query.companyId){
                query.companyId = req.query.companyId;
            }
            if(req.query.status){
                query.status = req.query.status;
            }
            const cursor = startupCollection.find(query);
            const result = await cursor.toArray();
            console.log(result)
            res.json(result);
        });

        app.post('/api/opportunities', async (req, res) => {
            const opportunity = req.body;
            console.log('New opportunity:', opportunity);
            const result = await startupCollection.insertOne(opportunity);
            res.json(result);
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})