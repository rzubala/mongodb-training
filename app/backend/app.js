const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb').MongoClient;
const credentials = require('./credentials')

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

const url = `mongodb+srv://${credentials.user}:${credentials.password}@cluster0.exuzk.mongodb.net/shop?retryWrites=true&w=majority`
mongodb.connect(url)
  .then(client => {
    console.log("Connected!")
    client.close()
  })
  .catch(err => {
    console.log(err)
  })

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

app.listen(3100);
