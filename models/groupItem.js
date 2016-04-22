var mongoose  = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var groupSchema = mongoose.Schema({
  gname  : String,
  description  : String,
  member: [],
  created_at    : { type: Date },
  updated_at    : { type: Date },
});

groupSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});
groupSchema.pre('update', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Groups', groupSchema);


