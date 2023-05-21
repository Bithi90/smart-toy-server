const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avf7i9k.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = client.db('disneyToy').collection('toys');
        const addedCollection = client.db('NewToy').collection('addedToy');

        app.get('/toys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        const toyCategoryCollection = client.db('toysCategory').collection('categories');

        app.get('/categories', async (req, res) => {
            const cursor = toyCategoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // addtoy

        app.post('/addedToy', async (req, res) => {
            const addToy = req.body;
            console.log(addToy);
            const result = await addedCollection.insertOne(addToy);
            res.send(result);
        })

        app.get('/addedToy/', async (req, res) => {
            // console.log(req.query);
            const cursor = addedCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, category_id: 1, price: 1, picture: 1, details: 1, rating: 1, available_Quantity: 1 },
            };

            const result = await toysCollection.findOne(query, options);
            res.send(result);
        })



        app.get("/category/:id", async (req, res) => {
            const id = req.params.id;

            const filter = { category_id: id };
            const result = await toysCollection.find(filter).toArray();

            res.send(result)
        })

        app.get("/category", async (req, res) => {

            const result = await toysCollection.find().toArray();

            res.send(result);
        })


        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, category_id: 1, img: 1 },
            };

            const result = await toyCategoryCollection.findOne(query, options);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Smart toy server is running')
})

app.listen(port, () => {
    console.log(`Smart Toy server is running on port ${port}`)
})