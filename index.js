const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
app.use(cors())
app.use(express.json())

// Database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xue6gdd.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        //MongoDB
        const db = client.db("nextShopDB");
        const productsCollection = db.collection('products')

        // Latest Products (Home page)
        app.get('/latest-products', async(req, res) => {
            const result =await productsCollection.find().sort({ createdAt: -1}).limit(4).toArray()
            res.send(result)
        })

        // All products
        app.get('/all-products', async (req, res) => {
            const result = await productsCollection.find().sort({ createdAt: -1 }).toArray();
            res.send(result);
        });

        // Products details
        app.get('/all-products/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        }); 

        // Add a product
        app.post('/all-products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        // GEt products filter by user email
        app.get('/manage-products', async (req, res) => {
            const email = req.query.email;
            const query = {}
                if(email){
                    query.userEmail = email
                }
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        // Manage products (delete)
        app.delete('/manage-products/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.deleteOne({ _id: new ObjectId(id)});
            res.send(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('NextShop Server is Running...')
})


app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
})