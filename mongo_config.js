// var MongoClient = require('mongodb').MongoClient, assert = require('assert');

// // Connection URL
// var url = 'mongodb://localhost:27017/lixu-chatroom';
// // Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");
//   if (!GLOBAL.logger){
//     GLOBAL.mongoDB = db;
//   }
//   // db.close();
// });


/**
* connect to MongoDB
*/

var mongoose   = require('mongoose'), assert = require('assert');
// var mongoUrl   = process.env.MONGODB_URL || 'mongodb://localhost/cookery_test';
var mongoHost = process.env.MONGODB_HOST || 'localhost';
var mongoUser = process.env.MONGODB_USER || '';
var mongoPassword = process.env.MONGODB_PASSWORD || '';
var mongoPort = process.env.MONGODB_PORT || '27017';
var mongoName = process.env.MONGODB_NAME || 'lixu-chatroom';
var mongoUrl = 'mongodb://'+mongoUser+ ':' + mongoPassword +'@'+ mongoHost +':' + mongoPort+'/' + mongoName;
mongoUrl = mongoUrl.replace(':@','');
console.log(mongoUrl)
GLOBAL.mongoDB = mongoose.connect(mongoUrl, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + mongoUrl + '. ' + err);
  } else {
    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    admin.buildInfo(function (err, info) {
     console.log("MONGO VERSION: " + info.version);
    });
    console.log ('Successfully connected to: ' + mongoUrl);
  }
});