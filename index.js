const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0opz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err)
  const blogCollection = client.db("kitchenGuru").collection("blogs");
  const adminCollection = client.db("kitchenGuru").collection("admins");
  console.log('database connected successfully');

  app.post('/addBlog', (req, res) => {
    const newBlog = req.body;
    console.log('adding new service: ', newBlog);
    blogCollection.insertOne(newBlog)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new service: ', newAdmin);
    adminCollection.insertOne(newAdmin)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/blogs', (req, res) => {
    blogCollection.find()
    .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items);
    })
  })

  app.get('/admins', (req, res) => {
    // console.log(req.query.email);
    adminCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  const ObjectID = require('mongodb').ObjectID
  app.delete('/deleteBlog/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this');
    blogCollection.deleteOne({ _id: id })
    .then((err, documents) => res.send(documents))
  })
  // perform actions on the collection object
    //   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})