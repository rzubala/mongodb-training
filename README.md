[udemy](udemy.com/course/mongodb-the-complete-developers-guide)

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
```js
find(filter, options)
findOne(filter, options)
```

## Update:
```js
updateOne(filter, data, options)
updateMany(filter, data, options)
replaceOne(filter, data, options)
```

## Delete:
```js
deleteOne(filter, options)
deleteMany(filter, options)
```


```js
db.flightData.updateOne({distance: 12000}, {$set: {marker: "delete"}})
```
set to pass the change
```js
db.flightData.find({distance: {$gt: 10000}}
```
greater than 10000

update vs updateMany: update override the entire object

```js
find()
```
 gives cursor not an object
```js
find().toArray()
```
gives the objects
```js
find().forEach()
```
iterate over the objects
```js
db.passengers.find().forEach((passengerData) => {printjson(passengerData)}
```

projection: one can choose only these key values we would like use
```js
db.passengers.find({}, {name: 1, _id: 0})
```
retrieve only names

```js
db.passengers.findOne({name: 'Albert Twostone'}).hobbies
```
access array [ 'sports', 'cooking' ]

```js
db.passengers.find({hobbies: "sports"})
```
filter in array
```js
db.flightData.find({"status.description": 'On-time'})
```
filter in subobject



`$lookup` aggregate data: book has authors field with an array of id of authors
```js
db.books.aggregate([{$lookup: {from: "authors", localField: "authors", foreignField: "_id", as: "creators"}}])
```

# SCHEMA
```js
db.createCollection("posts", {validator: {$jsonSchema: {bsonType: "object", required: ["title, text, creator, comments"]}}})
```
to create collection with schema validation
```js
db.runCommand({collMod: "posts",   validator: { $jsonSchema: {}})
```
to update existing schema


# INSERT
[insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)\
[insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/)\
[Atomicity](https://docs.mongodb.com/manual/core/write-operations-atomicity/#atomicity)\
[Write Concern](https://docs.mongodb.com/manual/reference/write-concern/)\
[Using mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/index.html)


```js
db.hobbies.insertMany([{_id: "yoga", name: "yoga"}, {_id: "cooking", name: "cooking"}, {_id: "hiking", name: "hiking"}], {ordered: false})
```
turn off ordered insert, continue after error occured

```js
db.persons.insertOne({name: "Chrissy", age: 41}, {writeConcern: {w:0}})
```
does not wait for  write
```js
db.persons.insertOne({name: "Michael", age: 41}, {writeConcern: {w:1, j: true}})
```
wait till it's written to journal
```js
db.persons.insertOne({name: "Aliya", age: 22}, {writeConcern: {w:1, j: true, wtimeout: 1}})
```
write timeout

`mongoimport tv-shows.json -d movieData -c movies --jsonArray --drop` to import data from json file


# FIND
[docs](https://docs.mongodb.com/manual/reference/method/db.collection.find/)

## operators
[docs](https://docs.mongodb.com/manual/reference/operator/query/)

```js
find({runtime: {$lt: 60}})
```
runtime < 60
`$ne, $eq, $gt, $lt, $lte, $gte`\
`$in, $nin`
```js
find({runtime: {$in: [30, 42]}})
```
runtine == 30 or runtime == 42

```js
find({$or: [{"rating.average": {$lt: 5}}, {"rating.average": {$gt: 9.3}}] })
```
rating.average < 5 or rating.average > 9.3\
`$nor` = not or

`$and`
```js
find({ $and: [{ "rating.average": { $gt: 9 } }, { "genres": "Drama" }] })
```
the same as:
```js
find({"rating.average": {$gt: 9}, genres: "Drama"})
```
```js
find({runtime: {$not: {$eq: 60}}})
```
!= 60

```js
find({age: {$exists: true}}
```
all documents that have age
```js
find({age: {$exists: true, $ne: null}})
```
all document with age and not null age
```js
find({phone: {$type: "number"}})
```
all documents that have phone as number


```js
find({summary: {$regex: /musical/}})
```
regex

```js
find({$expr: {$gt: ["$volume", "$target"]}})
```
data where volume > target
```js
find({$expr: {$gt: [{$cond: {if: {$gte: ["$volume", 190]}, then: {$subtract: ["$volume", 30]}, else: "$volume"}}, "$target"]}})
```
data where volume > target when volume < 190 or volume: 30 > target when volume >=190
        
### arrays
```js
find({hobbies: {$size: 3}})
```
objects with 3 hobbies
```js
find({"genre": {$all: ["action", "thriller"]}})
```
objects that have action of thiller in any order
```js
find({hobbies: {$elemMatch: {title: "Sports", frequency: {$gte: 3}}}})
```
documents where item array has title Sports and frequence >= 3
```js
find({ratings: {$elemMatch: {$gt: 8, $lt: 10}}})
```
element > 8 and < 10

## cursor
[docs](https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/)

```js
const dataCursor = db.movies.find()
```
get cursor
```js
dataCursor.next()
```
get next document
```js
dataCursor.hasNext()
```
check if there is next document
```js
dataCursor.forEach((doc) => {printjson(doc)})
```
loop over all documents
```js
find().sort({"rating.average": -1})
```
sort DESC, (-1: DESC, 1: ASC)
```js
find().skip(10)
```
skip first 10 documents
```js
find().limit(10)
```
retrieve only 10

## projection
```js
find({}, {name: 1, genres: 1, runtime: 1, rating: 1, _id: 0})
```
retrieve only name, genres, ... but not _id
```js
find({genres: "Drama"}, {"genres.$": 1})
```
display only genres: Drama, genres is an array
```js
find({genres: "Drama"}, {genres: {$elemMatch: {$eq: "Horror"}}})
```
display only genres: Horror
```js
find({genres: "Drama"}, {genres: {$slice: 2}, name: 1}
```
only first to genres
```js
find({genres: "Drama"}, {genres: {$slice: [1, 2]}, name: 1})
```
skip first, limit 2

# UPDATE
[update](https://docs.mongodb.com/manual/tutorial/update-documents/)
    
```js
updateOne({name: "Manuel"}, {$inc: {age: 1}})
```
age++
```js
updateOne({name: "Chris"}, {$min: {age: 38}})
```
only update when new age is lower than current
`$max`
```js
updateOne({name: "Chris"}, {$mul: {age: 1.1}})
```
age = age * 1.1

```js
updateMany({isSporty: true}, {$unset: {phone: ""}})
```
remove phone field from documents
```js
updateMany({}, {$rename: {age: "totalAge"}})
```
rename field from age to totalAge

```js
updateOne({name: "Maria"}, {$set: {age: 29, hobbies: [{title: "Good food", frequency: 3}], isSporty: true}}, {upsert: true})
```
insert document when not exists
```js
updateMany({hobbies: {$elemMatch: {title: "Sports", frequency: {$gte: 3}}}}, {$set: {"hobbies.$.highFrequency": true}})
```
add field highFrequency to subobject in array hobbies

### Arrays
```js
updateMany({totalAge: {$gt: 30}}, {$inc: {"hobbies.$[].frequency": -1}})
```
update all subobjects in an array
```js
updateMany({"hobbies.frequency": {$gt: 2}}, {$set: {"hobbies.$[el].goodFrequency": true}}, {arrayFilters: [{"el.frequency": {$gt: 2}}]})
```
update only subject with additional filter for el

```js
updateOne({name: "Maria"}, {$push: {hobbies: {title: "Sports", frequency: 2}}})
```
push new item to array hobbies
```js
updateOne({name: "Maria"}, {$addToSet: {hobbies: {title: "Hiking", frequency: 2}}})
```
push new item when does not exists
```js
updateOne({name: "Maria"}, {$push: {hobbies: {$each: [{title: "Good wine", frequency: 1}, {title: "Higing", frequency: 2}]}}})
```
push many items
```js
updateOne({name: "Maria"}, {$push: {hobbies: {$each: [{title: "Good wine", frequency: 1}, {title: "Higing", frequency: 2}], $sort: {frequency: -1}, $slice: 1}}})
```
sort before adding, and limit the number of items to add

```js
updateOne({name: "Maria"}, {$pull: {hobbies: {title: "Hiking"}}})
```
remove items Hiking from hobbies array
```js
updateOne({name: "Chris"}, {$pop: {hobbies: 1}})
```
remove last item, for -1 remove first

# DELETE
[docs](https://docs.mongodb.com/manual/tutorial/remove-documents/)

# INDEXES
[partialFilterExpressions](https://docs.mongodb.com/manual/core/index-partial/)

```js
db.contacts.explain().find({"dob.age": {$gt: 60}})
```
to display stats of query
```js
db.contacts.explain("executionStats").find({"dob.age": {$gt: 60}})
```
to display detailed stats of query

```js
db.contacts.createIndex({"dob.age": 1})
```
create index in asc order, -1 desc
```js
db.contacts.dropIndex({"dob.age": 1})
```
to remove the above index

```js
db.contacts.createIndex({"dob.age": 1, gender: 1})
```
compound index with 2 fields, it works for filtering by age and gender and by age (most left part of index) and
sort by gender

```js
db.contacts.getIndexes()
```
retrieve all indexes
```js
db.contacts.createIndex({email: 1}, {unique: true})
```
to create index and requires the value to be unique
```js
db.users.createIndex({email: 1}, {unique: true, partialFilterExpression: {email: {$exists: true}}})
```
email is required but consider only data where email exists
```js
db.contacts.createIndex({"dob.age": 1}, {partialFilterExpression: {gender: "male"}})
```
partial index for age with data where gender is male

### TTL Time to live
```js
db.sessions.createIndex({createdAt: 1}, {expireAfterSeconds: 10})
```
index for only 10 seconds than the document is removed

### Query convert by index
```js
db.customers.explain("executionStats").find({name: "Max"}, {_id: 0, name: 1})
```
there is an index on name, and we are returning only name: totalDocsExamined: 0

### Multikey index
when index is on array or field on embeded document which is item in array

### Text index
```js
db.products.createIndex({description: "text"})
```
text index where word in description are splitted
```js
db.products.explain().find({$text: {$search: "awesome"}})
```
search by text. One can be only one text index by collection. It looks for documents where any of the
search words exists\
```js
db.products.find({$text: {$search: "\"red book\""}})
```
to search for the exact phrase

```js
db.products.find({$text: {$search: "awsome t-shirt"}}, {score: {$meta: "textScore"}})
```
to display score
```js
db.products.find({$text: {$search: "awsome t-shirt"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
```
to sort by score

```js
db.products.createIndex({title: "text", description: "text"})
```
one can create index which merges text fields

```js
db.products.find({$text: {$search: "awsome -t-shirt"}})
```
minus before means that the world should be excluded (here t-shirt)
```js
db.products.createIndex({title: "text", description: "text"}, {default_language: "english", weights: {title:1, description: 10}})
```
one can define default language
and weights of the fields to calculate the score

### Background indexes
```js
db.ratings.createIndex({age: 1}, {background: true})
```

# Geospatial data
[docs](https://docs.mongodb.com/manual/geospatial-queries/)\
[Geospatial Query Operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/)

```js
db.places.insertOne({name: "California Academy of Sciences", location: {type: "Point", coordinates: [-122.4724356, 37.7672544]}})
```
GeoJson syntax

### index
```js
db.places.createIndex({location: "2dsphere"})
```
index is needed in order to use geo query

### geo query
```js
db.places.find({location: {$near: {$geometry: {type: "Point", coordinates: [-122.471114, 37.771104]}}}})
```
geo query
```js
db.places.find({location: {$near: {$geometry: {type: "Point", coordinates: [-122.471114, 37.771104]}, $maxDistance: 500, $minDistance: 10}}})
```
find places with the max and
min distance radius in sorted way\
```js
db.places.find({location: {$geoWithin: {$centerSphere: [[-122.46203, 37.77286], 1 / 6378.1]}}})
```
find places in radius 1km from center in unsorted order

### polygon
```js
const p1=[-122.4547, 37.77473]
const p2=[-122.45303, 37.76641]
const p3=[-122.51026, 37.76411]
const p4=[-122.51088, 37.77131]
db.places.find({location: {$geoWithin: {$geometry: {type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]]}}}})
```
query for all places inside the polygon
```js
db.areas.insertOne({name: "Golden Gate Park", area: {type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]]}})
```
insert area into the database
```js
db.areas.find({area: {$geoIntersects: {$geometry: {type: "Point", coordinates: [-122.49089, 37.76992]}}}})
```
check if point is inside area

# Aggregation
[Docs](https://docs.mongodb.com/manual/core/aggregation-pipeline/)\
[$cond](https://docs.mongodb.com/manual/reference/operator/aggregation/cond/)

Data:
```js
{
  _id: ObjectId("620183674749d836296de934"),
  gender: 'male',
  name: { title: 'mr', first: 'elijah', last: 'lewis' },
  location: {
    street: '2623 paddock way',
    city: 'virginia beach',
    state: 'wyoming',
    postcode: 54880,
    coordinates: { latitude: '-42.6128', longitude: '-18.5996' },
    timezone: { offset: '+3:30', description: 'Tehran' }
  },
  email: 'elijah.lewis@example.com',
  login: {
    uuid: '2292b7c7-a9bf-4341-abbd-c5841444ab6e',
    username: 'angrygorilla267',
    password: 'toonarmy',
    salt: 'DUtMcvWR',
    md5: '258eaa742373ee70976d53d1b84d4764',
    sha1: '62f168f38fa3f6efbd815b58518775d3c6cf0080',
    sha256: 'a4ab496047b9de7df39adbdabfecc813b8da428087029c94c2b748cef092f85e'
  },
  dob: { date: '1986-03-29T06:40:18Z', age: 32 },
  registered: { date: '2007-12-24T10:32:11Z', age: 10 },
  phone: '(187)-486-3727',
  cell: '(986)-974-0857',
  id: { name: 'SSN', value: '127-66-9786' },
  picture: {
    large: 'https://randomuser.me/api/portraits/men/57.jpg',
    medium: 'https://randomuser.me/api/portraits/med/men/57.jpg',
    thumbnail: 'https://randomuser.me/api/portraits/thumb/men/57.jpg'
  },
  nat: 'US'
}
```

### Pipeline
```js
db.persons.aggregate([
    {$match: {gender: 'female'}},
    {$group: {_id: { state: "$location.state" }, totalPersons: { $sum: 1 } }},
    {$sort: {totalPersons: -1}}
])
```
match - filtering step\
group - group by state and sum number of persons by state\
sort - sort the output in descending order

```js
{$group: {_id: { gender: "$gender"}, totalPersons: {$sum: 1}, averageAge: {$avg: "$dob.age"}}},
```
group by gender and sum persons and calculate average

### Projection
```js
db.persons.aggregate([
    {$project: { _id: 0, gender: 1, fullName: {$concat: ["$name.first", " ", "$name.last"]}}}
])
```
concat first and last name to full name

```js
db.persons.aggregate([
  {$project: {_id: 0, name: 1, email: 1, 
    birthdate: {$convert: {input: "$dob.date", to: "date"}},
    age: "$dob.age",
    location: {type: "Point", 
    coordinates: [
      { $convert: {input: "$location.coordinates.longitude", to: "double", onError: 0.0, onNull: 0.0}}, 
      { $convert: {input: "$location.coordinates.latitude", to: "double", onError: 0.0, onNull: 0.0}}, 
    ]}}},
  {$project: {gender: 1, email: 1, location: 1, birthdate: 1, age: 1,
    fullName: {$concat: 
    [
      { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
      { $substrCP: ["$name.first", 1, { $subtract: [ {$strLenCP: "$name.first"}, 1 ] }] },
      " ",
      { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
      { $substrCP: ["$name.last", 1, { $subtract: [ {$strLenCP: "$name.last"}, 1 ]}] },
    ],},
  },},
  { $group: {_id: {birthYear: {$isoWeekYear: "$birthdate" }}, numPersons: {$sum: 1 }}},
  { $sort: {numPersons: -1}}      
]);
```
cascade projection:
- convert the location to GeoJson and convert string to number
- convert string to date
- concat first and last name to full name and covert first letter to uppercase
- group by year of birth `$isoWeekYear`
- sort by number of persons in DESC order

### Shortcuts
```js
birthdate: {$convert: {input: "$dob.date", to: "date"}},
birthdate: {$toDate: "$dob.date"},
```
and others

### Arrays
Data:
```js
{
  _id: ObjectId("62036e11be1c9b98900273cd"),
  name: 'Max',
  hobbies: [ 'Sports', 'Cooking' ],
  age: 29,
  examScores: [
    { difficulty: 4, score: 57.9 },
    { difficulty: 6, score: 62.1 },
    { difficulty: 3, score: 88.5 }
  ]
}
```
```js
db.friends.aggregate([
  { $unwind: "$hobbies" },
  { $group: {_id: {age: "$age"}, allHobbies: {$push: "$hobbies"}}}
])
```
- `$unwind` flattend the array
- merge hobbies into single array when groupping, `$push` merge items from documents
- `$addToSet` removes duplicates, `$push` allows duplicates

```js
db.friends.aggregate([
  { $project: {_id: 0, examScore: {$slice: ["$examScores", 1, 1]}}}
])
```
`$slice` slice opperator on an array to create subArray starting from index. When index is negative than it starts from end. The third element is the length
```js
db.friends.aggregate([
  { $project: {_id: 0, numScores: {$size: "$examScores"}}}
])
```
returns the length of the array
```js
db.friends.aggregate([
  { $project: {
    _id: 0, 
    examScores: { $filter: { input: "$examScores", as: "sc", cond: { $gt: ["$$sc.score", 60] } } } }
  }
])
```
it uses for projection the `examScores.score` values that are greater than 60. `$$sc` refers to local variable defined in `as`
```js
db.friends.aggregate([
  { $unwind: "$examScores" },
  { $project: {_id: 1, name: 1, age: 1, score: "$examScores.score"}},
  { $sort: {score: -1 }},
  { $group: {_id: "$_id", name: {$first: "$name"}, maxScore: {$max: "$score"}} },
  { $sort: {maxScore: -1}}
])
```
retrieves the max score per person. `$first` returns the first element encountered in group

### Data analytics 
```js
db.persons.aggregate([
  { $bucket: { 
    groupBy: "$dob.age", 
    boundaries: [18, 30, 40, 50, 60, 120], 
    output: {
      numPersons: {$sum: 1},
      averageAge: {$avg: "$dob.age"},
      //names: { $push: "$name.first"}
    }}}
])
```
`bucket` groups persons by age ranges and displays number of persons in each group and calc the average
```js
db.persons.aggregate([
  { $bucketAuto: {
    groupBy: "$dob.age",
    buckets: 5,
    output: {
      numPersons: {$sum: 1},
      averageAge: {$avg: "$dob.age"},
      //names: { $push: "$name.first"}
    }    
  }}
])
```
`bucketAuto` automatically divides the persons in 5 groups (buckets)
