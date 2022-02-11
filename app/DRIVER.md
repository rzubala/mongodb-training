# Driver
[Node mongodb](https://docs.mongodb.com/drivers/node/current/)
[RESTful API with Node.js](https://academind.com/learn/node-js/building-a-restful-api-with/)

`npm install mongodb --save` to install the driver

You never connect to mongodb directly from the client application because you will expose your credentials to the user. On Node on server those credentials ara safe.

We use database connection pool, we have many connections to db `client.db()` with the single client `MongoClient`.

