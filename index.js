const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xlajaco.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client.db('FruitsHouse').collection('fruitsInfo');

      app.get('/fruitsInfo', async (req, res) => {
          const query = {};
          const cursor = fruitsCollection.find(query);
          const fruits = await cursor.toArray();
          res.send(fruits);
        });    

    app.get('/fruitsInfo/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const fruit = await fruitsCollection.findOne(query);
      res.send(fruit);
    });
    app.post('/fruitsInfo', async (req, res) => {
      const newFruit = req.body;
      const addedFruit = await fruitsCollection.insertOne(newFruit);
      res.send(addedFruit);
    });

    // find all items
    app.get('/myFruitsInfo', async (req, res) => {
      const email = req.query.email;
      console.log("email", email);
      const query = { email };
      const cursor = fruitsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });




    app.delete('/fruitsInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletFruit = await fruitsCollection.deleteOne(query);
      res.send(deletFruit)
    })


  }
  finally {

  }
}
run().catch(console.log('rejected'));



app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log('server is running with port', port);
});