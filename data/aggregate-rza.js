db.persons.aggregate([
  { $match: { gender: "female" } },
  { $group: { _id: { state: "$location.state" }, totalPersons: { $sum: 1 } } },
  { $sort: { totalPersons: -1 } },
]);

/*
older 50
group by gender, how many per gender, average age
sort: totalPersons
*/
db.persons.aggregate([
  { $match: { "dob.age": { $gt: 50 } } },
  {
    $group: {
      _id: { gender: "$gender" },
      totalPersons: { $sum: 1 },
      averageAge: { $avg: "$dob.age" },
    },
  },
  { $sort: { totalPersons: -1 } },
]);

db.persons.aggregate([
  {$project: {_id: 0, name: 1, email: 1, location: {type: "Point", 
    coordinates: [
      { $convert: {input: "$location.coordinates.longitude", to: "double", onError: 0.0, onNull: 0.0}}, 
      { $convert: {input: "$location.coordinates.latitude", to: "double", onError: 0.0, onNull: 0.0}}, 
    ]}}},
  {$project: {gender: 1, email: 1, location: 1,
    fullName: {$concat: 
    [
      { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
      { $substrCP: ["$name.first", 1, { $subtract: [ {$strLenCP: "$name.first"}, 1 ] }] },
      " ",
      { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
      { $substrCP: ["$name.last", 1, { $subtract: [ {$strLenCP: "$name.last"}, 1 ]}] },
    ],},
  },},
]);


