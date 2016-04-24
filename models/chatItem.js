var mongoose  = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var chatSchema = mongoose.Schema({
  owner  : String,
  ownerId  : String,
  to  : String,
  toId: String,

  created_at    : { type: Date },
  updated_at    : { type: Date },

});

chatSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});
chatSchema.pre('update', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Chat', chatSchema);


