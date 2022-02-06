# Basic commands

`show dbs` show databases\
`use flights` swith to database flights

To get rid of your data, you can simply load the database you want to get rid of (`use databaseName`) and then execute `db.dropDatabase()`.
Similarly, you could get rid of a single collection in a database via `db.myCollection.drop()`.

`db.flightData.insertOne({...})` insert json\
`db.flightData.find()` get data

## Create:
`insertOne(data, options)`\
`insertMany(data, options)`

## Read:
`find(filter, options)`\
`findOne(filter, options)`

## Update:
`updateOne(filter, data, options)`\
`updateMany(filter, data, options)`\
`replaceOne(filter, data, options)`

## Delete:
`deleteOne(filter, options)`\
`deleteMany(filter, options)`


`db.flightData.updateOne({distance: 12000}, {$set: {marker: "delete"}})` set to pass the change\
`db.flightData.find({distance: {$gt: 10000}}` greater than 10000

update vs updateMany: update override the entire object

`find()` gives cursor not an object\
`find().toArray()` gives the objects\
`find().forEach()` iterate over the objects\
`db.passengers.find().forEach((passengerData) => {printjson(passengerData)}`

projection: one can choose only these key values we would like use\
`db.passengers.find({}, {name: 1, _id: 0})` retrieve only names

`db.passengers.findOne({name: 'Albert Twostone'}).hobbies` access array
[ 'sports', 'cooking' ]

`db.passengers.find({hobbies: "sports"})` filter in array\
`db.flightData.find({"status.description": 'On-time'})` filter in subobject



`$lookup` aggregate data: book has authors field with an array of id of authors\
`db.books.aggregate([{$lookup: {from: "authors", localField: "authors", foreignField: "_id", as: "creators"}}])`

# SCHEMA
`db.createCollection("posts", {validator: {$jsonSchema: {bsonType: "object", required: ["title, text, creator, comments"]}}})` to create collection with schema validation\
`db.runCommand({collMod: "posts",   validator: { $jsonSchema: {}})` to update existing schema


# INSERT
[insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)\
[insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/)\
[Atomicity](https://docs.mongodb.com/manual/core/write-operations-atomicity/#atomicity)\
[Write Concern](https://docs.mongodb.com/manual/reference/write-concern/)\
[Using mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/index.html)


`db.hobbies.insertMany([{_id: "yoga", name: "yoga"}, {_id: "cooking", name: "cooking"}, {_id: "hiking", name: "hiking"}], {ordered: false})` turn off ordered insert, continue after error occured

`db.persons.insertOne({name: "Chrissy", age: 41}, {writeConcern: {w:0}})` does not wait for  write\
`db.persons.insertOne({name: "Michael", age: 41}, {writeConcern: {w:1, j: true}})` wait till it's written to journal\
`db.persons.insertOne({name: "Aliya", age: 22}, {writeConcern: {w:1, j: true, wtimeout: 1}})` write timeout

`mongoimport tv-shows.json -d movieData -c movies --jsonArray --drop` to import data from json file


# FIND
[docs](https://docs.mongodb.com/manual/reference/method/db.collection.find/)

## operators
[docs](https://docs.mongodb.com/manual/reference/operator/query/)

`find({runtime: {$lt: 60}})` runtime < 60\
`$ne, $eq, $gt, $lt, $lte, $gte`\
`$in, $nin`\
`find({runtime: {$in: [30, 42]}})` runtine == 30 or runtime == 42

`find({$or: [{"rating.average": {$lt: 5}}, {"rating.average": {$gt: 9.3}}] })`rating.average < 5 or rating.average > 9.3\
`$nor` = not or

`$and`\
`find({ $and: [{ "rating.average": { $gt: 9 } }, { "genres": "Drama" }] })`\
the same as:\
`find({"rating.average": {$gt: 9}, genres: "Drama"})`\
`find({runtime: {$not: {$eq: 60}}})` != 60


`find({age: {$exists: true}}` all documents that have age\
`find({age: {$exists: true, $ne: null}})` all document with age and not null age\
`find({phone: {$type: "number"}})` all documents that have phone as number


`find({summary: {$regex: /musical/}})` regex

`find({$expr: {$gt: ["$volume", "$target"]}})` data where volume > target\
`find({$expr: {$gt: [{$cond: {if: {$gte: ["$volume", 190]}, then: {$subtract: ["$volume", 30]}, else: "$volume"}}, "$target"]}})` data where volume > target when volume < 190 or volume: 30 > target when volume >=190
        
### arrays
`find({hobbies: {$size: 3}})` objects with 3 hobbies\
`find({"genre": {$all: ["action", "thriller"]}})` objects that have action of thiller in any order\
`find({hobbies: {$elemMatch: {title: "Sports", frequency: {$gte: 3}}}})` documents where item array has title Sports and frequence >= 3\
`find({ratings: {$elemMatch: {$gt: 8, $lt: 10}}})` element > 8 and < 10

## cursor
[docs](https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/)

`const dataCursor = db.movies.find()` get cursor\
`dataCursor.next()` get next document\
`dataCursor.hasNext()` check if there is next document\
`dataCursor.forEach((doc) => {printjson(doc)})` loop over all documents\
`find().sort({"rating.average": -1})` sort DESC, (-1: DESC, 1: ASC)\
`find().skip(10)` skip first 10 documents\
`find().limit(10)` retrieve only 10

## projection
`find({}, {name: 1, genres: 1, runtime: 1, rating: 1, _id: 0})` retrieve only name, genres, ... but not _id\
`find({genres: "Drama"}, {"genres.$": 1})` display only genres: Drama, genres is an array\
`find({genres: "Drama"}, {genres: {$elemMatch: {$eq: "Horror"}}})` display only genres: Horror\
`find({genres: "Drama"}, {genres: {$slice: 2}, name: 1}` only first to genres\
`find({genres: "Drama"}, {genres: {$slice: [1, 2]}, name: 1})` skip first, limit 2

# UPDATE
[update](https://docs.mongodb.com/manual/tutorial/update-documents/)
    
`updateOne({name: "Manuel"}, {$inc: {age: 1}})` age++\
`updateOne({name: "Chris"}, {$min: {age: 38}})` only update when new age is lower than current\
`$max`\
`updateOne({name: "Chris"}, {$mul: {age: 1.1}})` age = age * 1.1

`updateMany({isSporty: true}, {$unset: {phone: ""}})` remove phone field from documents\
`updateMany({}, {$rename: {age: "totalAge"}})` rename field from age to totalAge

`updateOne({name: "Maria"}, {$set: {age: 29, hobbies: [{title: "Good food", frequency: 3}], isSporty: true}}, {upsert: true})` insert document when not exists\
`updateMany({hobbies: {$elemMatch: {title: "Sports", frequency: {$gte: 3}}}}, {$set: {"hobbies.$.highFrequency": true}})` add field highFrequency to subobject in array hobbies

### Arrays
`updateMany({totalAge: {$gt: 30}}, {$inc: {"hobbies.$[].frequency": -1}})` update all subobjects in an array\
`updateMany({"hobbies.frequency": {$gt: 2}}, {$set: {"hobbies.$[el].goodFrequency": true}}, {arrayFilters: [{"el.frequency": {$gt: 2}}]})` update only subject with additional filter for el

`updateOne({name: "Maria"}, {$push: {hobbies: {title: "Sports", frequency: 2}}})` push new item to array hobbies\
`updateOne({name: "Maria"}, {$addToSet: {hobbies: {title: "Hiking", frequency: 2}}})` push new item when does not exists\
`updateOne({name: "Maria"}, {$push: {hobbies: {$each: [{title: "Good wine", frequency: 1}, {title: "Higing", frequency: 2}]}}})` push many items\
`updateOne({name: "Maria"}, {$push: {hobbies: {$each: [{title: "Good wine", frequency: 1}, {title: "Higing", frequency: 2}], $sort: {frequency: -1}, $slice: 1}}})` sort before adding, and limit the number of items to add

`updateOne({name: "Maria"}, {$pull: {hobbies: {title: "Hiking"}}})` remove items Hiking from hobbies array\
`updateOne({name: "Chris"}, {$pop: {hobbies: 1}})` remove last item, for -1 remove first

# DELETE
[docs](https://docs.mongodb.com/manual/tutorial/remove-documents/)

# INDEXES

`db.contacts.explain().find({"dob.age": {$gt: 60}})` to display stats of query\
`db.contacts.explain("executionStats").find({"dob.age": {$gt: 60}})` to display detailed stats of query

`db.contacts.createIndex({"dob.age": 1})` create index in asc order, -1 desc\
`db.contacts.dropIndex({"dob.age": 1})` to remove the above index

`db.contacts.createIndex({"dob.age": 1, gender: 1})` compound index with 2 fields, it works for filtering by age and gender and by age (most left part of index) and
sort by gender

`db.contacts.getIndexes()` retrieve all indexes\
`db.contacts.createIndex({email: 1}, {unique: true})` to create index and requires the value to be unique\
`db.users.createIndex({email: 1}, {unique: true, partialFilterExpression: {email: {$exists: true}}})` email is required but consider only data where email exists\
`db.contacts.createIndex({"dob.age": 1}, {partialFilterExpression: {gender: "male"}})` partial index for age with data where gender is male

### TTL Time to live
`db.sessions.createIndex({createdAt: 1}, {expireAfterSeconds: 10})` index for only 10 seconds than the document is removed

### Query convert by index
`db.customers.explain("executionStats").find({name: "Max"}, {_id: 0, name: 1})` there is an index on name, and we are returning only name: totalDocsExamined: 0

### Multikey index
when index is on array or field on embeded document which is item in array




