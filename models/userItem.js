var mongoose  = require('mongoose');

var userSchema = mongoose.Schema({
  name  : String,
  email  : String,
  password  : String,

  // position: [String], //岗位

  // years: String, //经验
  // salary: [String],
  // experience: String, //经历


  // contact: String, //联系人
  // mobile: String, //联系电话

  created_at    : { type: Date },
  updated_at    : { type: Date },

});

userSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});
userSchema.pre('update', function(next){
  now = new Date();
  this.updated_at = now;
  next();
});
module.exports = mongoose.model('User', userSchema);


